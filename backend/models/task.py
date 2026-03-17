import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Uuid

from extensions import db


class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"


class Task(db.Model):
    """Task entity scoped to a user."""

    __tablename__ = "tasks"
    __table_args__ = (
        db.Index("ix_tasks_user_id", "user_id"),
        db.Index("ix_tasks_status", "status"),
        db.Index("ix_tasks_priority", "priority"),
        db.Index("ix_tasks_category", "category"),
    )

    id = db.Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = db.Column(Uuid, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    priority = db.Column(
        db.Enum(TaskPriority, values_callable=lambda enum_cls: [item.value for item in enum_cls]),
        nullable=False,
        default=TaskPriority.MEDIUM.value,
    )

    deadline = db.Column(db.DateTime(timezone=True), nullable=True)
    category = db.Column(db.String(100), nullable=True)

    status = db.Column(
        db.Enum(TaskStatus, values_callable=lambda enum_cls: [item.value for item in enum_cls]),
        nullable=False,
        default=TaskStatus.PENDING.value,
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = db.relationship("User", back_populates="tasks")

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "title": self.title,
            "description": self.description,
            "priority": self.priority.value if self.priority else None,
            "deadline": self.deadline.isoformat()
            if isinstance(self.deadline, datetime)
            else None,
            "category": self.category,
            "status": self.status.value if self.status else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
