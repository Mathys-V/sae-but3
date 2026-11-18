import re
from datetime import datetime

from pydantic import BaseModel, Field, field_validator

EMAIL_REGEX = re.compile(r"^[\w\.-]+@[\w\.-]+\.[a-zA-Z0-9]{2,}$")
PSEUDO_REGEX = re.compile(r"^[a-zA-Z0-9_\-\.]{3,50}$")


class UserRegister(BaseModel):
    pseudo: str = Field(..., min_length=3, max_length=50, description="Le pseudo choisi par le joueur")
    email: str = Field(..., max_length=255, description="L'adresse email du joueur")
    password: str = Field(..., min_length=6, description="Le mot de passe (min 6 caractères)")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        clean = v.strip().lower()
        if not EMAIL_REGEX.match(clean):
            raise ValueError("Format d'adresse email invalide")
        return clean

    @field_validator("pseudo")
    @classmethod
    def validate_pseudo(cls, v: str) -> str:
        clean = v.strip()
        if not PSEUDO_REGEX.match(clean):
            raise ValueError("Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores")
        return clean


# Pour la compatibilité ascendante avec l'ancien schéma UserCreate
UserCreate = UserRegister


class UserLogin(BaseModel):
    # Supporte soit pseudo soit email dans l'identifiant
    pseudo: str = Field(..., description="Pseudo ou email du joueur")
    password: str = Field(..., description="Mot de passe")


class UserResponse(BaseModel):
    user_id: int
    pseudo: str
    email: str
    role: str
    banned_flag: bool
    created_at: datetime | None = None
    last_login: datetime | None = None
    message: str | None = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    pseudo: str
    email: str
    role: str


class BanUserRequest(BaseModel):
    banned: bool
    reason: str | None = None


class ChangeRoleRequest(BaseModel):
    role: str = Field(..., pattern="^(player|admin)$", description="Nouveau rôle : 'player' ou 'admin'")


class UserListResponse(BaseModel):
    total: int
    users: list[UserResponse]
