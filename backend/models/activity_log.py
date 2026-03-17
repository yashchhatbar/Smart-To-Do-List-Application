import uuid
from datetime import datetime, timezone

from sqlalchemy import Uuid

from extensions import db


class ActivityLog(db.Model):
    """Audit log entry for user and system activity."""

    __tablename__ = "activity_logs"
    __table_args__ = (
        db.Index("ix_activity_logs_user_id", "user_id"),
        db.Index("ix_activity_logs_action", "action"),
        db.Index("ix_activity_logs_created_at", "created_at"),
    )

    id = db.Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = db.Column(Uuid, db.ForeignKey("users.id"), nullable=True)
    action = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    ip_address = db.Column(db.String(64), nullable=True)
    user_agent = db.Column(db.String(512), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    user = db.relationship("User", back_populates="activity_logs")

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id) if self.user_id else None,
            "action": self.action,
            "description": self.description,
            "ip_address": self.ip_address,
            "user_agent": self.user_agent,
            "created_at": self.created_at.isoformat(),
            "user": self.user.to_dict() if self.user else None,
        }
