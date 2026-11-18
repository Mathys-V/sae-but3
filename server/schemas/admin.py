from pydantic import BaseModel


class AdminOverviewStats(BaseModel):
    total_users: int
    active_users: int
    banned_users: int
    admin_count: int
    total_sessions: int
    sessions_today: int
    global_abandon_rate: float
    avg_session_duration_minutes: float
    retention_rate: float


class AdminGameStats(BaseModel):
    game_id: int
    game_name: str
    difficulty: str
    total_played: int
    completed: int
    abandoned: int
    abandon_rate: float
    avg_time_seconds: int
    high_score: int
    avg_score: int
    health_status: str  # 'healthy', 'warning', 'critical'


class HourlyActivity(BaseModel):
    hour: int
    session_count: int


class AbandonBreakdown(BaseModel):
    early_drop: int  # < 1 min (Ragequit)
    mid_game: int  # 1 - 5 min
    late_game: int  # > 5 min


class AdminRetentionStats(BaseModel):
    hourly_activity: list[HourlyActivity]
    abandon_breakdown: AbandonBreakdown
    total_time_played_hours: float
