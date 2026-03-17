import uuid

from flask import Blueprint, request

from extensions import db
from schemas.task import (
    load_task_create_payload,
    load_task_filters,
    load_task_update_payload,
)
from services.activity_service import log_activity
from services.auth_service import token_required
from services.task_service import (
    build_task_query,
    create_task_for_user,
    delete_task_for_user,
    get_task_or_404,
    update_task_for_user,
)
from utils.api import success_response
from utils.exceptions import AppError


tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.get("")
@token_required
def list_tasks(current_user):
    """Return all tasks for the current user with optional filters."""

    filters = load_task_filters(request.args)
    tasks = build_task_query(current_user.id, filters).all()
    serialized_tasks = [task.to_dict() for task in tasks]

    return success_response(
        "Tasks fetched successfully",
        data={"tasks": serialized_tasks},
        tasks=serialized_tasks,
    )


@tasks_bp.post("")
@token_required
def create_task(current_user):
    """Create a new task for the current user."""

    payload = request.get_json(silent=True)
    if payload is None:
        raise AppError("Request body must be valid JSON", status_code=400)

    data = load_task_create_payload(payload)
    task = create_task_for_user(current_user, data)
    log_activity(
        current_user.id,
        "task_create",
        f"Task created: {task.title}",
        request,
    )
    db.session.commit()

    return success_response(
        "Task created",
        data={"task": task.to_dict()},
        status_code=201,
        task=task.to_dict(),
    )


@tasks_bp.put("/<task_id>")
@token_required
def update_task(current_user, task_id):
    """Update an existing task owned by the current user."""

    try:
        parsed_task_id = uuid.UUID(task_id)
    except ValueError as exc:
        raise AppError("Task not found", status_code=404) from exc

    payload = request.get_json(silent=True)
    if payload is None:
        raise AppError("Request body must be valid JSON", status_code=400)

    data = load_task_update_payload(payload)
    task = get_task_or_404(parsed_task_id, current_user.id)
    task = update_task_for_user(task, data)
    log_activity(
        current_user.id,
        "task_update",
        f"Task updated: {task.title}",
        request,
    )
    db.session.commit()

    return success_response(
        "Task updated",
        data={"task": task.to_dict()},
        task=task.to_dict(),
    )


@tasks_bp.delete("/<task_id>")
@token_required
def delete_task(current_user, task_id):
    """Delete a task owned by the current user."""

    try:
        parsed_task_id = uuid.UUID(task_id)
    except ValueError as exc:
        raise AppError("Task not found", status_code=404) from exc

    task = get_task_or_404(parsed_task_id, current_user.id)
    task_title = task.title
    delete_task_for_user(task)
    log_activity(
        current_user.id,
        "task_delete",
        f"Task deleted: {task_title}",
        request,
    )
    db.session.commit()

    return success_response("Task deleted", data={})
