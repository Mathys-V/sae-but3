from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.user import (
    BanUserRequest,
    ChangeRoleRequest,
    UserListResponse,
    UserResponse,
)
from security import require_admin

router = APIRouter(prefix="/api/admin", tags=["Administration & Modération"])


@router.get("/users", response_model=UserListResponse)
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: str | None = Query(None, description="Recherche par pseudo ou email"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    """Liste tous les utilisateurs enregistrés avec recherche et pagination."""
    query = db.query(User)
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(User.pseudo.ilike(search_filter), User.email.ilike(search_filter))
        )

    total = query.count()
    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()

    return UserListResponse(
        total=total,
        users=[
            UserResponse(
                user_id=u.user_id,
                pseudo=u.pseudo,
                email=u.email,
                role=u.role,
                banned_flag=u.banned_flag,
                created_at=u.created_at,
                last_login=u.last_login,
            )
            for u in users
        ],
    )


@router.patch("/users/{user_id}/ban", response_model=UserResponse)
def toggle_ban_user(
    user_id: int,
    req: BanUserRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    """Bannit ou débannit un utilisateur."""
    if current_admin.user_id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de modifier votre propre statut de bannissement.",
        )

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur introuvable.",
        )

    user.banned_flag = req.banned
    db.commit()
    db.refresh(user)

    action_text = "banni" if req.banned else "débanni"
    return UserResponse(
        user_id=user.user_id,
        pseudo=user.pseudo,
        email=user.email,
        role=user.role,
        banned_flag=user.banned_flag,
        created_at=user.created_at,
        last_login=user.last_login,
        message=f"L'utilisateur {user.pseudo} a été {action_text} avec succès.",
    )


@router.patch("/users/{user_id}/role", response_model=UserResponse)
def change_user_role(
    user_id: int,
    req: ChangeRoleRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    """Change le rôle d'un utilisateur ('player' ou 'admin')."""
    if current_admin.user_id == user_id and req.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de retirer vos propres privilèges d'administrateur.",
        )

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur introuvable.",
        )

    user.role = req.role
    db.commit()
    db.refresh(user)

    return UserResponse(
        user_id=user.user_id,
        pseudo=user.pseudo,
        email=user.email,
        role=user.role,
        banned_flag=user.banned_flag,
        created_at=user.created_at,
        last_login=user.last_login,
        message=f"Le rôle de {user.pseudo} a été modifié en '{user.role}'.",
    )
