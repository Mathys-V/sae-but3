from pydantic import BaseModel

class ScoreEntry(BaseModel):
    rank: int
    pseudo: str
    score: int

class LeaderboardResponse(BaseModel):
    game_id: str
    scores: list[ScoreEntry]