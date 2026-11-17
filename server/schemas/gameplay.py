from pydantic import BaseModel, Field


class RecordGameSessionRequest(BaseModel):
    game_name: str = Field(
        ...,
        description="Nom ou identifiant court du jeu ('plongee', 'casino', 'tutoriel' ou nom complet)",
    )
    score: int = Field(0, description="Score ou pièces obtenues")
    time_seconds: int = Field(0, description="Durée de la partie en secondes")
    completed: bool = Field(
        True,
        description="True si la partie s'est finie normalement, False si abandon ou mort",
    )
    status: str = Field("finished", description="Statut de fin ('finished' ou 'abandoned')")


class RecordGameSessionResponse(BaseModel):
    success: bool
    session_id: int
    game_id: int
    game_name: str
    score: int
    time_seconds: int
    winner_flag: bool
    user_pseudo: str
    message: str
