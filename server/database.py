import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Charger .env depuis la racine ou le dossier server
env_paths = [
    Path(__file__).parent / ".env",
    Path(__file__).parent.parent / ".env",
    Path(__file__).parent.parent / "database" / ".env"
]
for p in env_paths:
    if p.exists():
        load_dotenv(p)
        break

DEFAULT_DB_URL = "postgresql://evil_user:evil_password@localhost:5432/evil_mescours_db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

# SQLAlchemy 2.0 requiert postgresql+psycopg2:// quand psycopg2 est utilisé
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

# Si l'URL utilise sqlite (ex: tests ou dev local sans docker), configurer check_same_thread
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dépendance FastAPI fournissant une session SQLAlchemy."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
