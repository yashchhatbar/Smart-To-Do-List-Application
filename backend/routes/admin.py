from flask import Blueprint, request

from extensions import db
from models.user import User
from schemas.admin import load_activity_log_filters, load_admin_login_payload
from services.activity_service import (
    get_activity_logs,
    get_admin_dashboard_metrics,
    get_all_users,
    get_recent_activity_logs,
    log_activity,
)
from services.auth_service import issue_tokens, require_admin, verify_password
from utils.api import success_response
from utils.exceptions import AppError


admin_bp = Blueprint("admin", __name__)


@admin_bp.post("/login")
def admin_login():
    """Authenticate an admin user."""

    payload = request.get_json(silent=True)
    if payload is None:
        raise AppError("Request body must be valid JSON", status_code=400)

    data = load_admin_login_payload(payload)
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not verify_password(data["password"], user.password):
        raise AppError("Invalid email or password", status_code=401)
    if not user.is_admin:
        raise AppError("Admin access is required", status_code=403)

    log_activity(user.id, "login", f"Admin logged in: {user.email}", request)
    db.session.commit()
    tokens = issue_tokens(user)

    return success_response(
        "Admin login successful",
        data={"user": user.to_dict(), **tokens},
        user=user.to_dict(),
        **tokens,
    )


@admin_bp.get("/dashboard")
@require_admin
def admin_dashboard(current_user):
    """Return admin dashboard metrics and recent activity."""

    metrics = get_admin_dashboard_metrics()
    recent_logs = [log.to_dict() for log in get_recent_activity_logs(limit=10)]
    return success_response(
        "Admin dashboard fetched successfully",
        data={
            **metrics,
            "recent_activity_logs": recent_logs,
        },
    )


@admin_bp.get("/users")
@require_admin
def list_users(current_user):
    """Return all users for the admin panel."""

    users = [user.to_dict() for user in get_all_users()]
    return success_response("Users fetched successfully", data={"users": users})


@admin_bp.get("/activity-logs")
@require_admin
def list_activity_logs(current_user):
    """Return paginated activity logs for admins."""

    filters = load_activity_log_filters(request.args)
    pagination = get_activity_logs(filters)

    return success_response(
        "Activity logs fetched successfully",
        data={
            "logs": [log.to_dict() for log in pagination.items],
            "pagination": {
                "page": pagination.page,
                "per_page": pagination.per_page,
                "total": pagination.total,
                "pages": pagination.pages,
                "has_next": pagination.has_next,
                "has_prev": pagination.has_prev,
            },
            "filters": {
                "action": filters.get("action"),
                "user_id": str(filters["user_id"]) if filters.get("user_id") else None,
                "date_from": filters["date_from"].date().isoformat()
                if filters.get("date_from")
                else None,
                "date_to": filters["date_to"].date().isoformat()
                if filters.get("date_to")
                else None,
            },
        },
    )
