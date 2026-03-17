from marshmallow import Schema, ValidationError, fields, post_load, validate


def _normalize_string(value):
    if value is None:
        return value
    return value.strip()


class SignupSchema(Schema):
    """Validate signup payloads."""

    name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=120),
        error_messages={"required": "Name is required"},
    )
    email = fields.Email(required=True, error_messages={"required": "Email is required"})
    password = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(min=8, max=128),
        error_messages={"required": "Password is required"},
    )

    @post_load
    def normalize(self, data, **_kwargs):
        data["name"] = _normalize_string(data["name"])
        data["email"] = _normalize_string(data["email"]).lower()
        return data


class LoginSchema(Schema):
    """Validate login payloads."""

    email = fields.Email(required=True, error_messages={"required": "Email is required"})
    password = fields.String(
        required=True,
        load_only=True,
        error_messages={"required": "Password is required"},
    )

    @post_load
    def normalize(self, data, **_kwargs):
        data["email"] = _normalize_string(data["email"]).lower()
        return data


class RefreshTokenSchema(Schema):
    """Validate refresh token payloads."""

    refresh_token = fields.String(
        required=True,
        error_messages={"required": "Refresh token is required"},
    )


def load_signup_payload(payload):
    return SignupSchema().load(payload)


def load_login_payload(payload):
    return LoginSchema().load(payload)


def load_refresh_token_payload(payload):
    return RefreshTokenSchema().load(payload)
