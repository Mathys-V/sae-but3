from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from models.user import User, UserSetting
from schemas.user import TokenResponse, UserLogin, UserRegister, UserResponse
from security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/api/auth", tags=["Authentification"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"description": "Pseudo ou email déjà utilisé."},
    },
)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """Inscrit un nouvel utilisateur et initialise ses paramètres par défaut."""
    # Vérification d'unicité du pseudo
    existing_pseudo = db.query(User).filter(User.pseudo == user_in.pseudo).first()
    if existing_pseudo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce pseudo est déjà utilisé."
        )

    # Vérification d'unicité de l'email
    existing_email = db.query(User).filter(User.email == user_in.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette adresse email est déjà enregistrée."
        )

    # Hachage sécurisé du mot de passe avec Bcrypt
    hashed_pwd = hash_password(user_in.password)

    # Création de l'utilisateur
    new_user = User(
        pseudo=user_in.pseudo,
        email=user_in.email,
        password_hash=hashed_pwd,
        role="player",
        banned_flag=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialisation automatique des préférences par défaut (user_settings)
    default_settings = UserSetting(
        user_id=new_user.user_id,
        control_scheme="arrows",
        colorblind_flag=False,
    )
    db.add(default_settings)
    db.commit()

    return UserResponse(
        user_id=new_user.user_id,
        pseudo=new_user.pseudo,
        email=new_user.email,
        role=new_user.role,
        banned_flag=new_user.banned_flag,
        created_at=new_user.created_at,
        last_login=new_user.last_login,
        message="Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    responses={
        401: {"description": "Identifiants incorrects."},
        403: {"description": "Compte banni."},
    },
)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authentifie un utilisateur (pseudo ou email) et délivre un jeton JWT."""
    user = (
        db.query(User)
        .filter(or_(User.pseudo == credentials.pseudo, User.email == credentials.pseudo.lower()))
        .first()
    )

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects."
        )

    # Vérification du statut de bannissement
    if user.banned_flag:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Votre compte a été banni par l'administration."
        )

    # Mise à jour de la date de dernière connexion
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    # Génération du JWT
    token_payload = {
        "sub": str(user.user_id),
        "pseudo": user.pseudo,
        "role": user.role,
    }
    token = create_access_token(token_payload)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.user_id,
        pseudo=user.pseudo,
        email=user.email,
        role=user.role,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Renvoie le profil de l'utilisateur actuellement connecté."""
    return UserResponse(
        user_id=current_user.user_id,
        pseudo=current_user.pseudo,
        email=current_user.email,
        role=current_user.role,
        banned_flag=current_user.banned_flag,
        created_at=current_user.created_at,
        last_login=current_user.last_login,
        message="Utilisateur authentifié",
    )
