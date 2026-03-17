from flask import Flask
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from config import Config
from extensions import bcrypt, cors, db, migrate
from models import ActivityLog, Task, User
from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from utils.api import error_response, success_response
from utils.exceptions import AppError
from utils.logging import configure_logging


def create_app(config_class=Config):
    """Application factory."""

    app = Flask(__name__)
    app.config.from_object(config_class)

    configure_logging(app)
    @app.after_request
    def after_request(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response
    register_extensions(app)
    register_blueprints(app)
    register_error_handlers(app)

    @app.get("/api/health")
    def health_check():
        return success_response("Smart To-Do backend is running")

    return app


def register_extensions(app):
    """Register Flask extensions."""

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": ["http://localhost:3000"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
        supports_credentials=True,
    )


def register_blueprints(app):
    """Register API blueprints."""

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")


def register_error_handlers(app):
    """Register global exception handlers."""

    @app.errorhandler(AppError)
    def handle_app_error(error):
        if error.status_code >= 500:
            app.logger.exception("Application error: %s", error.message)
        return error_response(
            error.message,
            status_code=error.status_code,
            errors=error.errors,
            data=error.data,
        )

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return error_response(
            "Validation failed",
            status_code=400,
            errors=error.normalized_messages(),
        )

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(error):
        db.session.rollback()
        app.logger.exception("Database integrity error")
        return error_response("A database constraint was violated", status_code=409)

    @app.errorhandler(SQLAlchemyError)
    def handle_database_error(error):
        db.session.rollback()
        app.logger.exception("Database error")
        return error_response("A database error occurred", status_code=500)

    @app.errorhandler(404)
    def handle_not_found(_error):
        return error_response("Resource not found", status_code=404)

    @app.errorhandler(405)
    def handle_method_not_allowed(_error):
        return error_response("Method not allowed", status_code=405)

    @app.errorhandler(Exception)
    def handle_server_error(error):
        db.session.rollback()
        app.logger.exception("Unhandled server error: %s", error)
        return error_response("Internal server error", status_code=500)
