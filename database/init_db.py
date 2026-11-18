#!/usr/bin/env python3
"""
init_db.py — Crée la base de données du projet SAE BUT3 à partir des scripts SQL.

Usage :
    python init_db.py                 # structure seule (équivalent production)
    python init_db.py --with-seed     # structure + données de démo (DÉVELOPPEMENT UNIQUEMENT)
    python init_db.py --dry-run       # liste les scripts sans les exécuter
    python init_db.py --yes           # saute la confirmation interactive (CI/scripts)

Prérequis :
    - pip install psycopg2-binary
    - Variable d'environnement DATABASE_URL (fichier .env à côté du
      script, jamais commité) — format et exemple : voir .env.example

Convention des fichiers (dossier sql/ à côté du script) :
    01_users.sql ... 14_user_profiles.sql     -> structure, exécutés dans l'ordre du tri
    seed.sql                                  -> données de démo, exécuté seulement avec --with-seed
"""

import argparse
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

try:
    import psycopg2
except ImportError:
    sys.exit("psycopg2 manquant : pip install psycopg2-binary")

# Charge DATABASE_URL depuis .env si présent (sans dépendance externe)
def load_dotenv(path: Path = Path(__file__).parent / ".env") -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())

load_dotenv()

SQL_DIR = Path(__file__).parent / "sql"
STRUCTURE_PATTERN = re.compile(r"^\d{2,3}_.+\.sql$")   # 001_... ou 01_...
SEED_NAME = "seed.sql"


def collect_scripts(with_seed: bool) -> list[Path]:
    """Fichiers de structure triés (+ seed en option), dans l'ordre d'exécution."""
    if not SQL_DIR.is_dir():
        sys.exit(f"Dossier introuvable : {SQL_DIR}")
    structure = sorted(p for p in SQL_DIR.iterdir() if STRUCTURE_PATTERN.match(p.name))
    if not structure:
        sys.exit(f"Aucun script de structure trouvé dans {SQL_DIR}")
    # Garde-fou : numérotation homogène obligatoire (2 chiffres OU 3 chiffres).
    # Un mélange casserait le tri : "015_x" se trierait AVANT "01_x".
    widths = {len(p.name.split("_", 1)[0]) for p in structure}
    if len(widths) > 1:
        sys.exit(
            "Numérotation incohérente dans sql/ : mélange de préfixes "
            f"{sorted(widths)} chiffres ({', '.join(p.name for p in structure[:5])}...). "
            "Uniformiser avant exécution."
        )
    scripts = list(structure)
    if with_seed:
        seed = SQL_DIR / SEED_NAME
        if not seed.exists():
            sys.exit(f"--with-seed demandé mais {seed} est introuvable")
        scripts.append(seed)
    return scripts


def run_script(conn, path: Path) -> None:
    """Exécute un script dans UNE transaction : tout réussit ou rien n'est appliqué."""
    sql = path.read_text(encoding="utf-8")
    with conn.cursor() as cur:
        cur.execute(sql)# NOSONAR


def main() -> int:
    parser = argparse.ArgumentParser(description="Déploiement de la base SAE BUT3")
    parser.add_argument("--with-seed", action="store_true",
                        help="exécute aussi seed.sql (DONNÉES DE DÉMO — jamais en production)")
    parser.add_argument("--dry-run", action="store_true",
                        help="affiche les scripts qui seraient exécutés, sans rien exécuter")
    parser.add_argument("--yes", "-y", action="store_true",
                        help="saute la confirmation interactive")
    args = parser.parse_args()

    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit("DATABASE_URL non définie (variable d'environnement ou fichier .env)")

    scripts = collect_scripts(args.with_seed)

    parsed_url = urlsplit(url)

    print(
        f"Cible        : {parsed_url.hostname}:"
        f"{parsed_url.port or 5432}/"
        f"{parsed_url.path.lstrip('/')}"
    )
    print(f"Scripts      : {len(scripts)}")
    for s in scripts:
        print(f"  - {s.name}")

    if args.dry_run:
        print("\n[dry-run] Aucun script exécuté.")
        return 0

    if args.with_seed and not args.yes:
        answer = input(
            "\n⚠️  --with-seed insère des DONNÉES DE DÉMONSTRATION (développement uniquement).\n"
            "   Confirmer ? [oui/non] "
        ).strip().lower()
        if answer not in ("oui", "o", "yes", "y"):
            print("Annulé.")
            return 1

    try:
        with psycopg2.connect(url) as conn:
            for path in scripts:
                try:
                    run_script(conn, path)
                    conn.commit()
                    print(f"✓ {path.name}")
                except psycopg2.Error as e:
                    conn.rollback()
                    print(f"✗ {path.name} — {e.pgcode} : {e.diag.message_primary}")
                    return 1
    except psycopg2.OperationalError as e:
        print(f"\nConnexion impossible : {e}")
        print("Vérifier : PostgreSQL lancé ? DATABASE_URL correcte ? accès réseau / pg_hba.conf ?")
        return 1

    print("\nBase déployée avec succès.")
    return 0


if __name__ == "__main__":
    sys.exit(main())