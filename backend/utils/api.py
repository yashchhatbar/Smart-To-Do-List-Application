from flask import jsonify


def success_response(message, data=None, status_code=200, **extra):
    """Return a standardized success payload."""

    payload = {
        "success": True,
        "message": message,
        "data": data or {},
    }
    payload.update(extra)
    return jsonify(payload), status_code


def error_response(message, status_code=400, errors=None, data=None):
    """Return a standardized error payload."""

    payload = {
        "success": False,
        "message": message,
        "data": data or {},
    }
    if errors:
        payload["errors"] = errors
    return jsonify(payload), status_code
