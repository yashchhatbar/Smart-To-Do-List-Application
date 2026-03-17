import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration loaded from environment variables."""

    # ---------------------------
    # DATABASE
    # ---------------------------
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///smart_todo.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ---------------------------
    # GENERAL
    # ---------------------------
    JSON_SORT_KEYS = False
    PROPAGATE_EXCEPTIONS = False
    MAX_CONTENT_LENGTH = 1024 * 1024  # 1MB

    # ---------------------------
    # JWT CONFIG
    # ---------------------------
    JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
    JWT_REFRESH_EXPIRATION_DAYS = int(
        os.getenv("JWT_REFRESH_EXPIRATION_DAYS", "7")
    )

    ACCESS_TOKEN_EXPIRES = timedelta(hours=JWT_EXPIRATION_HOURS)
    REFRESH_TOKEN_EXPIRES = timedelta(days=JWT_REFRESH_EXPIRATION_DAYS)

    # ---------------------------
    # CORS CONFIG (✅ FIXED)
    # ---------------------------
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,https://your-frontend.vercel.app"
        ).split(",")
        if origin.strip()
    ]

    # ---------------------------
    # LOGGING
    # ---------------------------
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
