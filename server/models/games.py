from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    SmallInteger,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from database import Base


class Game(Base):
    __tablename__ = "games"

    game_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    module_id = Column(Integer, ForeignKey("modules.module_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    data = Column(JSONB, nullable=False)
    difficulty = Column(String(20), nullable=False, default="easy")
    config = Column(JSONB, nullable=True)
    multiplayer_flag = Column(Boolean, nullable=False, default=False)
    min_players = Column(SmallInteger, nullable=False, default=1)
    max_players = Column(SmallInteger, nullable=False, default=1)
    active_flag = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    last_modified_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)

    __table_args__ = (
        CheckConstraint(
            "difficulty IN ('easy', 'medium', 'hard')",
            name="check_games_difficulty"
        ),
        CheckConstraint(
            "min_players BETWEEN 1 AND 4",
            name="check_games_min_players"
        ),
        CheckConstraint(
            "max_players BETWEEN 1 AND 4",
            name="check_games_max_players"
        ),
        CheckConstraint(
            "min_players <= max_players",
            name="check_games_players_range"
        ),
    )
