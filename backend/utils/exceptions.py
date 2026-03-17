class AppError(Exception):
    """Custom application exception with HTTP metadata."""

    def __init__(self, message, status_code=400, errors=None, data=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.errors = errors
        self.data = data or {}
