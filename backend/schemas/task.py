from marshmallow import Schema, fields, post_load, validate


ALLOWED_PRIORITIES = ("low", "medium", "high")
ALLOWED_STATUSES = ("pending", "completed")


def _normalize_optional_text(value):
    if value is None:
        return None

    cleaned = value.strip()
    return cleaned or None


class TaskBaseSchema(Schema):
    """Shared validation for task request bodies."""

    title = fields.String(validate=validate.Length(min=1, max=255))
    description = fields.String(allow_none=True, validate=validate.Length(max=5000))
    priority = fields.String(validate=validate.OneOf(ALLOWED_PRIORITIES))
    deadline = fields.DateTime(allow_none=True)
    category = fields.String(allow_none=True, validate=validate.Length(max=100))
    status = fields.String(validate=validate.OneOf(ALLOWED_STATUSES))

    @post_load
    def normalize(self, data, **_kwargs):
        if "title" in data:
            data["title"] = data["title"].strip()
        if "description" in data:
            data["description"] = _normalize_optional_text(data["description"])
        if "category" in data:
            data["category"] = _normalize_optional_text(data["category"])
        if "priority" in data:
            data["priority"] = data["priority"].strip().lower()
        if "status" in data:
            data["status"] = data["status"].strip().lower()
        return data


class TaskCreateSchema(TaskBaseSchema):
    """Validate task creation payloads."""

    title = fields.String(
        required=True,
        validate=validate.Length(min=1, max=255),
        error_messages={"required": "Title is required"},
    )
    priority = fields.String(load_default="medium", validate=validate.OneOf(ALLOWED_PRIORITIES))
    status = fields.String(load_default="pending", validate=validate.OneOf(ALLOWED_STATUSES))


class TaskUpdateSchema(TaskBaseSchema):
    """Validate task update payloads."""


class TaskFilterSchema(Schema):
    """Validate list task query parameters."""

    priority = fields.String(load_default=None, validate=validate.OneOf(ALLOWED_PRIORITIES))
    status = fields.String(load_default=None, validate=validate.OneOf(ALLOWED_STATUSES))
    category = fields.String(load_default=None, validate=validate.Length(max=100))
    search = fields.String(load_default=None, validate=validate.Length(max=255))
    q = fields.String(load_default=None, validate=validate.Length(max=255))

    @post_load
    def normalize(self, data, **_kwargs):
        if data.get("category"):
            data["category"] = data["category"].strip()
        if data.get("search"):
            data["search"] = data["search"].strip()
        if data.get("q"):
            data["q"] = data["q"].strip()
        if not data.get("search") and data.get("q"):
            data["search"] = data["q"]
        data.pop("q", None)
        return data


def load_task_create_payload(payload):
    return TaskCreateSchema().load(payload)


def load_task_update_payload(payload):
    return TaskUpdateSchema(partial=True).load(payload)


def load_task_filters(query_params):
    return TaskFilterSchema().load(query_params)
