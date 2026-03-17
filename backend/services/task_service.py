from sqlalchemy import func, or_

from extensions import db
from models.task import Task, TaskPriority, TaskStatus
from utils.exceptions import AppError


def build_task_query(user_id, filters):
    """Build a filtered task query for a given user."""

    query = Task.query.filter(Task.user_id == user_id)

    if filters.get("priority"):
        query = query.filter(Task.priority == TaskPriority(filters["priority"]))
    if filters.get("status"):
        query = query.filter(Task.status == TaskStatus(filters["status"]))
    if filters.get("category"):
        query = query.filter(func.lower(Task.category) == filters["category"].lower())
    if filters.get("search"):
        pattern = f"%{filters['search']}%"
        query = query.filter(or_(Task.title.ilike(pattern), Task.description.ilike(pattern)))

    return query.order_by(Task.created_at.desc())


def create_task_for_user(user, data):
    """Create and persist a task for a user."""

    task = Task(
        user_id=user.id,
        title=data["title"],
        description=data.get("description"),
        priority=TaskPriority(data.get("priority", "medium")),
        deadline=data.get("deadline"),
        category=data.get("category"),
        status=TaskStatus(data.get("status", "pending")),
    )
    db.session.add(task)
    db.session.flush()
    return task


def get_task_or_404(task_id, user_id):
    """Load a task or raise a 404 application error."""

    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        raise AppError("Task not found", status_code=404)
    return task


def update_task_for_user(task, data):
    """Apply updates to a task and persist them."""

    if "title" in data:
        task.title = data["title"]
    if "description" in data:
        task.description = data["description"]
    if "priority" in data:
        task.priority = TaskPriority(data["priority"])
    if "deadline" in data:
        task.deadline = data["deadline"]
    if "category" in data:
        task.category = data["category"]
    if "status" in data:
        task.status = TaskStatus(data["status"])

    db.session.flush()
    return task


def delete_task_for_user(task):
    """Delete a task."""

    db.session.delete(task)
    db.session.flush()
