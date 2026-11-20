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
    UniqueConstraint,
    func,
)

from database import Base


class Module(Base):
    __tablename__ = "modules"

    module_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    cursus_year = Column(SmallInteger, nullable=False)
    image_url = Column(String(255), nullable=True)
    by_default_flag = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    last_modified_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)

    __table_args__ = (
        CheckConstraint("cursus_year BETWEEN 1 AND 3", name="check_modules_cursus_year"),
    )


class UserModule(Base):
    __tablename__ = "users_modules"

    user_module_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.module_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), nullable=False, default="in_progress")
    attempts = Column(Integer, nullable=False, default=0)
    best_score = Column(Integer, nullable=True)
    best_time = Column(Integer, nullable=True)
    date_completion = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("user_id", "module_id", name="unique_users_modules"),
        CheckConstraint(
            "status IN ('locked', 'in_progress', 'completed')",
            name="check_users_modules_status"
        ),
    )


class UserStat(Base):
    __tablename__ = "user_stats"

    user_stat_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    stat_key = Column(String(50), nullable=False)
    stat_value = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "stat_key", name="unique_user_stats"),
    )
