from flask import Blueprint, request

from extensions import db
from models.user import User
from schemas.auth import (
    load_login_payload,
    load_refresh_token_payload,
    load_signup_payload,
)
from services.activity_service import log_activity
from services.auth_service import (
    decode_token,
    get_user_from_token_payload,
    hash_password,
    issue_tokens,
    token_required,
    verify_password,
)
from utils.api import success_response
from utils.exceptions import AppError

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/signup")
def signup():
    """Create a new user account and issue JWTs."""

    payload = request.get_json(silent=True)
    if payload is None:
        raise AppError("Request body must be valid JSON", status_code=400)

    data = load_signup_payload(payload)

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        raise AppError("Email is already registered", status_code=409)

    user = User(
        name=data["name"],
        email=data["email"],
        password=hash_password(data["password"]),
    )

    db.session.add(user)
    db.session.flush()
    log_activity(
        user.id,
        "signup",
        f"User account created for {user.email}",
        request,
    )
    db.session.commit()

    tokens = issue_tokens(user)
    return success_response(
        "Signup successful",
        data={"user": user.to_dict(), **tokens},
        status_code=201,
        user=user.to_dict(),
        **tokens,
    )


@auth_bp.post("/login")
def login():
    """Authenticate a user and issue JWTs."""

    payload = request.get_json(silent=True)
    if payload is None:
        raise AppError("Request body must be valid JSON", status_code=400)

    data = load_login_payload(payload)

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not verify_password(data["password"], user.password):
        raise AppError("Invalid email or password", status_code=401)

    log_activity(user.id, "login", f"User logged in: {user.email}", request)
    db.session.commit()
    tokens = issue_tokens(user)
    return success_response(
        "Login successful",
        data={"user": user.to_dict(), **tokens},
        user=user.to_dict(),
        **tokens,
    )


@auth_bp.post("/refresh")
def refresh():
    """Exchange a refresh token for a new access token."""

    payload = request.get_json(silent=True)
    if payload is None:
        raise AppError("Request body must be valid JSON", status_code=400)

    data = load_refresh_token_payload(payload)
    token_payload = decode_token(data["refresh_token"], expected_type="refresh")
    user = get_user_from_token_payload(token_payload)
    tokens = issue_tokens(user)

    return success_response(
        "Token refreshed",
        data={"user": user.to_dict(), **tokens},
        user=user.to_dict(),
        **tokens,
    )


@auth_bp.post("/logout")
@token_required
def logout(current_user):
    """Log a user logout event."""

    log_activity(current_user.id, "logout", f"User logged out: {current_user.email}", request)
    db.session.commit()
    return success_response("Logout successful", data={})
