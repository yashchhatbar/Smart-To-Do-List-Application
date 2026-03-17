import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path


def configure_logging(app):
    """Configure application logging for development and production."""

    if getattr(app, "_logging_configured", False):
        return

    log_level = getattr(logging, app.config.get("LOG_LEVEL", "INFO"), logging.INFO)
    log_dir = Path(app.root_path).parent / "logs"
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / "app.log"

    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s [%(name)s] %(message)s"
    )

    file_handler = RotatingFileHandler(log_file, maxBytes=1_048_576, backupCount=3)
    file_handler.setLevel(log_level)
    file_handler.setFormatter(formatter)

    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(log_level)
    stream_handler.setFormatter(formatter)

    app.logger.handlers.clear()
    app.logger.setLevel(log_level)
    app.logger.addHandler(file_handler)
    app.logger.addHandler(stream_handler)
    app._logging_configured = True
