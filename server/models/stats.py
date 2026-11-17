from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, SmallInteger, String, Text, func
from sqlalchemy.orm import relationship

from database import Base


class Game(Base):
    __tablename__ = "games"

    game_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    module_id = Column(Integer, nullable=False)
    name = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(20), nullable=False, default="easy")
    active_flag = Column(Boolean, nullable=False, default=True)
    multiplayer_flag = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SessionGame(Base):
    __tablename__ = "sessions"

    session_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    host_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), nullable=False, default="waiting")  # 'waiting', 'in_progress', 'finished'
    current_game_id = Column(Integer, ForeignKey("games.game_id", ondelete="SET NULL"), nullable=True)
    invite_code = Column(String(25), nullable=False, unique=True)
    max_players = Column(SmallInteger, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    game = relationship("Game")
    users = relationship("SessionUser", back_populates="session", cascade="all, delete-orphan")


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


class Score(Base):
    __tablename__ = "scores"

    score_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.game_id", ondelete="CASCADE"), nullable=False)
    session_id = Column(Integer, ForeignKey("sessions.session_id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False, default=0)
    time = Column(Integer, nullable=False, default=0)  # durée en secondes
    winner_flag = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    game = relationship("Game")
