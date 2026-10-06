from fastapi import APIRouter
from schemas.score import LeaderboardResponse, ScoreEntry

router = APIRouter(prefix="/api/leaderboard", tags=["Scores"])

@router.get("/{game_id}", response_model=LeaderboardResponse)
async def get_leaderboard(game_id: str):
    fake_scores = [
        ScoreEntry(rank=1, pseudo="DarkSasuke", score=9500),
        ScoreEntry(rank=2, pseudo="MaitreDuCode", score=8200),
    ]
    return LeaderboardResponse(game_id=game_id, scores=fake_scores)