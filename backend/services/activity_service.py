from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import joinedload

from extensions import db
from models.activity_log import ActivityLog
from models.task import Task
from models.user import User


def get_client_ip(request):
    """Extract the most reliable client IP available."""

    forwarded_for = request.headers.get("X-Forwarded-For", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.headers.get("X-Real-IP") or request.remote_addr


def log_activity(user_id, action, description, request):
    """Persist an activity log entry on the current session."""

    log = ActivityLog(
        user_id=user_id,
        action=action,
        description=description,
        ip_address=get_client_ip(request),
        user_agent=(request.headers.get("User-Agent") or "")[:512] or None,
    )
    db.session.add(log)
    return log


def get_recent_activity_logs(limit=10):
    """Return recent activity logs with joined user data."""

    return (
        ActivityLog.query.options(joinedload(ActivityLog.user))
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
        .all()
    )


def get_activity_logs(filters):
    """Return paginated activity logs using supported filters."""

    query = ActivityLog.query.options(joinedload(ActivityLog.user))

    if filters.get("action"):
        query = query.filter(ActivityLog.action == filters["action"])
    if filters.get("user_id"):
        query = query.filter(ActivityLog.user_id == filters["user_id"])
    if filters.get("date_from"):
        query = query.filter(ActivityLog.created_at >= filters["date_from"])
    if filters.get("date_to"):
        query = query.filter(ActivityLog.created_at <= filters["date_to"])

    return query.order_by(ActivityLog.created_at.desc()).paginate(
        page=filters["page"],
        per_page=filters["per_page"],
        error_out=False,
    )


def get_admin_dashboard_metrics():
    """Return aggregate admin dashboard metrics."""

    total_users = db.session.query(func.count(User.id)).scalar() or 0
    total_tasks = db.session.query(func.count(Task.id)).scalar() or 0
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    total_active_users = (
        db.session.query(func.count(func.distinct(ActivityLog.user_id)))
        .filter(
            ActivityLog.user_id.isnot(None),
            ActivityLog.action == "login",
            ActivityLog.created_at >= thirty_days_ago,
        )
        .scalar()
        or 0
    )

    return {
        "total_users": total_users,
        "total_tasks": total_tasks,
        "total_active_users": total_active_users,
    }


def get_all_users():
    """Return users ordered by creation date."""

    return User.query.order_by(User.created_at.desc()).all()
