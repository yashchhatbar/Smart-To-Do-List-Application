from datetime import datetime, time, timezone

from marshmallow import Schema, fields, post_load, validate


ALLOWED_ACTIVITY_ACTIONS = (
    "signup",
    "login",
    "logout",
    "task_create",
    "task_update",
    "task_delete",
)


class AdminLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)

    @post_load
    def normalize(self, data, **_kwargs):
        data["email"] = data["email"].strip().lower()
        return data


class ActivityLogFilterSchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
    action = fields.String(load_default=None, allow_none=True, validate=validate.OneOf(ALLOWED_ACTIVITY_ACTIONS))
    user_id = fields.UUID(load_default=None, allow_none=True)
    date_from = fields.Date(load_default=None, allow_none=True)
    date_to = fields.Date(load_default=None, allow_none=True)

    @post_load
    def normalize(self, data, **_kwargs):
        if data.get("date_from"):
            data["date_from"] = datetime.combine(data["date_from"], time.min, tzinfo=timezone.utc)

        if data.get("date_to"):
            data["date_to"] = datetime.combine(data["date_to"], time.max, tzinfo=timezone.utc)

        return data


def load_admin_login_payload(payload):
    return AdminLoginSchema().load(payload)


def load_activity_log_filters(query_params):
    return ActivityLogFilterSchema().load(query_params)