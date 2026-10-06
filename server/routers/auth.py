from fastapi import APIRouter, HTTPException
from schemas.user import UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentification"])

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    if user.pseudo.lower() == "admin":
        raise HTTPException(status_code=400, detail="Pseudo déjà pris.")
    return UserResponse(id=1, pseudo=user.pseudo, message="Compte créé (données fictives)")

@router.post("/login")
async def login(user: UserLogin):
    if user.password != "azerty":
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    return {"access_token": "fake-jwt", "token_type": "bearer", "pseudo": user.pseudo}