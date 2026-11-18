from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.stats import Game, Score
from models.user import User
from schemas.score import LeaderboardResponse, ScoreEntry

router = APIRouter(prefix="/api/leaderboard", tags=["Scores"])


@router.get("/{game_id}", response_model=LeaderboardResponse)
def get_leaderboard(game_id: str, db: Annotated[Session, Depends(get_db)]):
    """Renvoie les meilleurs scores réels enregistrés en base pour un jeu donné."""
    # Résolution du jeu
    if game_id.isdigit():
        game = db.query(Game).filter(Game.game_id == int(game_id)).first()
    else:
        target = game_id.strip()
        game = db.query(Game).filter(Game.name.ilike(f"%{target}%")).first()
        if not game:
            if "casino" in target.lower():
                game = db.query(Game).filter(Game.name.ilike("%Casino%")).first()
            elif "plong" in target.lower():
                game = db.query(Game).filter(Game.name.ilike("%Plongée%")).first()
            elif "tuto" in target.lower():
                game = db.query(Game).filter(Game.name.ilike("%Tutoriel%")).first()

    if not game:
        return LeaderboardResponse(game_id=game_id, scores=[])

    # Requête des meilleurs scores réels avec jointure utilisateur
    raw_scores = (
        db.query(Score, User.pseudo)
        .join(User, Score.user_id == User.user_id)
        .filter(Score.game_id == game.game_id)
        .order_by(Score.score.desc())
        .limit(10)
        .all()
    )

    score_entries = [
        ScoreEntry(rank=idx, pseudo=pseudo, score=score_obj.score)
        for idx, (score_obj, pseudo) in enumerate(raw_scores, start=1)
    ]

    return LeaderboardResponse(game_id=game_id, scores=score_entries)
