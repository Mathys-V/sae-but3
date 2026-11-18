import uuid
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.stats import Game, Score, SessionGame, SessionUser, UserModule
from models.user import User
from schemas.gameplay import RecordGameSessionRequest, RecordGameSessionResponse
from security import get_optional_current_user

router = APIRouter(prefix="/api/games", tags=["Gameplay & Sessions"])


@router.post("/record-session", response_model=RecordGameSessionResponse, status_code=status.HTTP_201_CREATED)
def record_game_session(
    req: RecordGameSessionRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User | None, Depends(get_optional_current_user)] = None,
):
    """
    Enregistre une session et un score réels lors d'une partie jouée sur le site.
    Fonctionne aussi bien pour un utilisateur connecté que pour un joueur invité.
    """
    # 1. Résolution du jeu en base
    target = req.game_name.strip()
    game = db.query(Game).filter(Game.name.ilike(f"%{target}%")).first()

    if not game:
        # Correspondances courantes
        if "plong" in target.lower():
            game = db.query(Game).filter(Game.name.ilike("%Plongée%")).first()
        elif "casino" in target.lower() or "manchot" in target.lower():
            game = db.query(Game).filter(Game.name.ilike("%Casino%")).first()
        elif "tuto" in target.lower():
            game = db.query(Game).filter(Game.name.ilike("%Tutoriel%")).first()

    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Jeu '{req.game_name}' introuvable dans le catalogue.",
        )

    # 2. Résolution du joueur (compte réel ou compte invité technique)
    if current_user:
        player = current_user
    else:
        # Joueur invité sans compte
        guest_user = db.query(User).filter(User.pseudo == "invite_guest").first()
        if not guest_user:
            guest_user = User(
                pseudo="invite_guest",
                email="invite@evil.local",
                password_hash="$2b$12$eXAMPLeHaSHFoRInViTeGuEstAccOuntOnLy",
                role="player",
                banned_flag=False,
            )
            db.add(guest_user)
            db.commit()
            db.refresh(guest_user)
        player = guest_user

    # 3. Création de la session réelle
    now = datetime.now(timezone.utc)
    duration_sec = max(1, req.time_seconds)
    session_start = now - timedelta(seconds=duration_sec)
    code = f"RUN{uuid.uuid4().hex[:6].upper()}"

    # Si la partie a été abandonnée, le statut reste in_progress
    session_status = "finished" if req.completed and req.status == "finished" else "in_progress"
    ended_at = now if req.completed else None

    session_game = SessionGame(
        host_id=player.user_id,
        status=session_status,
        current_game_id=game.game_id,
        invite_code=code,
        max_players=1,
        created_at=session_start,
        ended_at=ended_at,
    )
    db.add(session_game)
    db.flush()

    # 4. Enregistrement de la présence du joueur dans la session
    session_user = SessionUser(
        session_id=session_game.session_id,
        user_id=player.user_id,
        role="host",
        ready_flag=True,
        connected_flag=not req.completed,
        joined_at=session_start,
        left_at=now,
    )
    db.add(session_user)

    # 5. Enregistrement du score réel
    score_entry = Score(
        user_id=player.user_id,
        game_id=game.game_id,
        session_id=session_game.session_id,
        score=max(0, req.score),
        time=duration_sec,
        winner_flag=req.completed,
        created_at=now,
    )
    db.add(score_entry)

    # 6. Mise à jour de la progression du module pour les joueurs enregistrés
    if player.pseudo != "invite_guest":
        progress = (
            db.query(UserModule)
            .filter(
                UserModule.user_id == player.user_id,
                UserModule.module_id == game.module_id,
            )
            .first()
        )
        if not progress:
            progress = UserModule(
                user_id=player.user_id,
                module_id=game.module_id,
                status="completed" if req.completed else "in_progress",
                attempts=1,
                best_score=req.score,
                best_time=duration_sec if req.completed else None,
                date_completion=now if req.completed else None,
            )
            db.add(progress)
        else:
            progress.attempts += 1
            if req.score > (progress.best_score or 0):
                progress.best_score = req.score
            if req.completed:
                if progress.best_time is None or duration_sec < progress.best_time:
                    progress.best_time = duration_sec
                progress.status = "completed"
                if not progress.date_completion:
                    progress.date_completion = now

    db.commit()
    db.refresh(session_game)
    db.refresh(score_entry)

    state_desc = "victoire" if req.completed else "abandon / défaite"
    return RecordGameSessionResponse(
        success=True,
        session_id=session_game.session_id,
        game_id=game.game_id,
        game_name=game.name,
        score=score_entry.score,
        time_seconds=score_entry.time,
        winner_flag=score_entry.winner_flag,
        user_pseudo=player.pseudo,
        message=f"Partie enregistrée avec succès ({state_desc}).",
    )
