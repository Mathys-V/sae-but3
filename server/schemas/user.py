from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    pseudo: str = Field(..., min_length=3, max_length=20, description="Le pseudo choisi par le joueur")
    password: str = Field(..., min_length=6, description="Le mot de passe en clair (sera haché plus tard)")

class UserLogin(BaseModel):
    pseudo: str
    password: str

class UserResponse(BaseModel):
    id: int
    pseudo: str
    message: str