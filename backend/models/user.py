import uuid
from datetime import datetime, timezone

from sqlalchemy import Uuid

from extensions import db


class User(db.Model):
    """Application user model."""

    __tablename__ = "users"

    id = db.Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False, server_default=db.false())
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    tasks = db.relationship(
        "Task", back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )
    activity_logs = db.relationship(
        "ActivityLog",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat(),
        }
