from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    achievement_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    game_id = Column(Integer, ForeignKey("games.game_id", ondelete="CASCADE"), nullable=True)
    unlock_condition = Column(JSONB, nullable=False)
    icon_url = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    last_modified_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)


class UserAchievement(Base):
    __tablename__ = "users_achievements"

    user_achievement_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(
        Integer,
        ForeignKey("achievements.achievement_id", ondelete="CASCADE"),
        nullable=False
    )
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="unique_users_achievements"),
    )
