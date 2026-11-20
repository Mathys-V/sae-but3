from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    SmallInteger,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from database import Base


class SessionGame(Base):
    __tablename__ = "sessions"

    session_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    host_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), nullable=False, default="waiting")
    current_game_id = Column(Integer, ForeignKey("games.game_id", ondelete="SET NULL"), nullable=True)
    invite_code = Column(String(25), nullable=False, unique=True)
    max_players = Column(SmallInteger, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    game = relationship("Game")
    users = relationship("SessionUser", back_populates="session", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint(
            "status IN ('waiting', 'in_progress', 'finished')",
            name="check_sessions_status"
        ),
        CheckConstraint(
            "max_players BETWEEN 1 AND 4",
            name="check_sessions_max_players"
        ),
    )


class SessionUser(Base):
    __tablename__ = "sessions_users"

    session_user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("sessions.session_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False, default="player")
    ready_flag = Column(Boolean, nullable=False, default=False)
    connected_flag = Column(Boolean, nullable=False, default=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    left_at = Column(DateTime(timezone=True), nullable=True)

    session = relationship("SessionGame", back_populates="users")

    __table_args__ = (
        UniqueConstraint("session_id", "user_id", name="unique_sessions_users"),
        CheckConstraint(
            "role IN ('host', 'player')",
            name="check_sessions_users_role"
        ),
    )


class Move(Base):
    __tablename__ = "moves"

    move_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("sessions.session_id", ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.game_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    move_data = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Score(Base):
    __tablename__ = "scores"

    score_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.game_id", ondelete="CASCADE"), nullable=False)
    session_id = Column(Integer, ForeignKey("sessions.session_id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    time = Column(Integer, nullable=False)
    winner_flag = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    game = relationship("Game")
