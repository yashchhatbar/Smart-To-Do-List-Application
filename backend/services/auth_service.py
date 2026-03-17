import uuid
from datetime import datetime, timezone
from functools import wraps

import jwt
from flask import current_app, request

from extensions import bcrypt
from models.user import User
from utils.exceptions import AppError


def hash_password(password):
    """Hash a plaintext password."""

    return bcrypt.generate_password_hash(password).decode("utf-8")


def verify_password(password, hashed_password):
    """Verify a plaintext password against the stored hash."""

    return bcrypt.check_password_hash(hashed_password, password)


def _build_token_payload(user, token_type, expires_delta):
    now = datetime.now(timezone.utc)
    return {
        "sub": str(user.id),
        "email": user.email,
        "is_admin": user.is_admin,
        "type": token_type,
        "jti": str(uuid.uuid4()),
        "iat": now,
        "exp": now + expires_delta,
    }


def generate_token(user, token_type="access"):
    """Generate a signed JWT for the given user."""

    expires_delta = (
        current_app.config["ACCESS_TOKEN_EXPIRES"]
        if token_type == "access"
        else current_app.config["REFRESH_TOKEN_EXPIRES"]
    )
    payload = _build_token_payload(user, token_type=token_type, expires_delta=expires_delta)
    return jwt.encode(
        payload,
        current_app.config["JWT_SECRET"],
        algorithm=current_app.config["JWT_ALGORITHM"],
    )


def issue_tokens(user):
    """Generate access and refresh tokens for a user."""

    access_token = generate_token(user, token_type="access")
    refresh_token = generate_token(user, token_type="refresh")
    return {
        "token": access_token,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
        "expires_in": int(current_app.config["ACCESS_TOKEN_EXPIRES"].total_seconds()),
    }


def decode_token(token, expected_type="access"):
    """Decode and validate a JWT."""

    try:
        payload = jwt.decode(
            token,
            current_app.config["JWT_SECRET"],
            algorithms=[current_app.config["JWT_ALGORITHM"]],
        )
    except jwt.ExpiredSignatureError as exc:
        raise AppError("Authorization token has expired", status_code=401) from exc
    except jwt.InvalidTokenError as exc:
        raise AppError("Authorization token is invalid", status_code=401) from exc

    if payload.get("type") != expected_type:
        raise AppError("Authorization token is invalid", status_code=401)

    return payload


def get_user_from_token_payload(payload):
    """Load the user referenced by a token payload."""

    try:
        user_id = uuid.UUID(payload["sub"])
    except (KeyError, ValueError, TypeError) as exc:
        raise AppError("Authorization token is invalid", status_code=401) from exc

    current_user = User.query.filter_by(id=user_id).first()
    if not current_user:
        raise AppError("User not found", status_code=401)

    return current_user


def token_required(view_func):
    """Protect routes with access-token authentication."""

    @wraps(view_func)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            raise AppError("Authorization token is missing", status_code=401)

        token = auth_header.split(" ", 1)[1].strip()
        payload = decode_token(token, expected_type="access")
        current_user = get_user_from_token_payload(payload)

        return view_func(current_user, *args, **kwargs)

    return wrapped


def require_admin(view_func):
    """Protect routes with access-token authentication and admin role checks."""

    @token_required
    @wraps(view_func)
    def wrapped(current_user, *args, **kwargs):
        if not current_user.is_admin:
            raise AppError("Admin access is required", status_code=403)
        return view_func(current_user, *args, **kwargs)

    return wrapped
