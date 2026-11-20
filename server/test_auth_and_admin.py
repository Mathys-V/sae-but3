import os
import sys
from pathlib import Path

# Configurer SQLite en mémoire pour les tests
os.environ["DATABASE_URL"] = "sqlite:///./test_evil.db"
os.environ["JWT_SECRET_KEY"] = "super-secret-key-at-least-32-characters-for-testing-sae-but3!"

sys.path.insert(0, str(Path(__file__).parent))

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import database
import security
from database import Base
from models.stats import Game
from models.user import User, UserSetting
from routers.admin import (
    change_user_role,
    get_games_stats,
    get_overview_stats,
    get_retention_stats,
    list_users,
    toggle_ban_user,
)
from routers.auth import login, register
from routers.gameplay import record_game_session
from routers.leaderboard import get_leaderboard
from schemas.gameplay import RecordGameSessionRequest
from schemas.user import BanUserRequest, ChangeRoleRequest, UserLogin, UserRegister

# Configurer SQLite en mémoire pour les tests
test_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

database.engine = test_engine
database.SessionLocal = TestingSessionLocal

# Rebind Base
Base.metadata.create_all(bind=test_engine)


def run_tests():
    db = TestingSessionLocal()
    print("--- 1. TEST INSCRIPTION ---")
    reg_alice = UserRegister(pseudo="alice", email="alice@etu.univ.fr", password="password123")
    res_alice = register(reg_alice, db)
    print(f"Alice inscrite : ID={res_alice.user_id}, Pseudo={res_alice.pseudo}, Role={res_alice.role}")
    assert res_alice.pseudo == "alice"
    assert res_alice.role == "player"
    assert not res_alice.banned_flag

    # Vérifier que les paramètres par défaut sont bien créés
    setting = db.query(UserSetting).filter(UserSetting.user_id == res_alice.user_id).first()
    assert setting is not None
    assert setting.control_scheme == "arrows"
    print("Paramètres par défaut créés avec succès pour Alice.")

    print("\n--- 2. TEST DOUBLE INSCRIPTION (DOUBLON PSEUDO) ---")
    try:
        register(reg_alice, db)
        raise AssertionError("Devrait échouer avec 400")
    except HTTPException as e:
        print("Erreur attendue capturée :", e.detail)
        assert e.status_code == 400

    print("\n--- 3. TEST CONNEXION ---")
    # Mauvais mot de passe
    try:
        login(UserLogin(pseudo="alice", password="wrongpassword"), db)
        raise AssertionError("Devrait échouer avec 401")
    except HTTPException as e:
        print("Erreur mauvais mdp capturée :", e.detail)
        assert e.status_code == 401

    # Bon mot de passe
    login_res = login(UserLogin(pseudo="alice", password="password123"), db)
    print(f"Connexion réussie : token={login_res.access_token[:20]}..., role={login_res.role}")
    assert login_res.role == "player"

    # Connexion avec l'email au lieu du pseudo
    login_by_email = login(UserLogin(pseudo="alice@etu.univ.fr", password="password123"), db)
    assert login_by_email.pseudo == "alice"
    print("Connexion via adresse email réussie !")

    print("\n--- 4. TEST CRÉATION ADMIN & PANEL MODÉRATION ---")
    reg_prof = UserRegister(pseudo="prof", email="prof@univ.fr", password="profpassword123")
    res_prof = register(reg_prof, db)
    prof_user = db.query(User).filter(User.user_id == res_prof.user_id).first()
    prof_user.role = "admin"
    db.commit()
    db.refresh(prof_user)

    # Alice (joueur) tente d'accéder au panel admin -> doit échouer
    alice_user = db.query(User).filter(User.user_id == res_alice.user_id).first()
    try:
        security.require_admin(alice_user)
        raise AssertionError("Alice ne doit pas pouvoir accéder au panel admin")
    except HTTPException as e:
        print("Accès refusé attendu pour Alice :", e.detail)
        assert e.status_code == 403

    # Prof (admin) liste les utilisateurs
    users_list = list_users(skip=0, limit=10, search=None, db=db, current_admin=prof_user)
    print(f"Total utilisateurs trouvés : {users_list.total}")
    assert users_list.total == 2

    # Recherche par pseudo
    search_res = list_users(skip=0, limit=10, search="ali", db=db, current_admin=prof_user)
    assert search_res.total == 1
    assert search_res.users[0].pseudo == "alice"
    print("Recherche 'ali' renvoie bien Alice.")

    print("\n--- 5. TEST BANNISSEMENT & DÉBANNISSEMENT ---")
    # Prof bannit Alice
    ban_res = toggle_ban_user(
        user_id=alice_user.user_id,
        req=BanUserRequest(banned=True),
        db=db,
        current_admin=prof_user,
    )
    assert ban_res.banned_flag is True
    print(f"Alice bannie : {ban_res.message}")

    # Alice tente de se connecter -> bloquée avec 403
    try:
        login(UserLogin(pseudo="alice", password="password123"), db)
        raise AssertionError("Connexion joueur banni devrait être refusée")
    except HTTPException as e:
        print("Connexion refusée pour joueur banni :", e.detail)
        assert e.status_code == 403

    # Prof débannit Alice
    unban_res = toggle_ban_user(
        user_id=alice_user.user_id,
        req=BanUserRequest(banned=False),
        db=db,
        current_admin=prof_user,
    )
    assert unban_res.banned_flag is False
    print(f"Alice débannie : {unban_res.message}")

    # Alice peut se reconnecter
    reconnect_res = login(UserLogin(pseudo="alice", password="password123"), db)
    assert reconnect_res.pseudo == "alice"
    print("Alice reconnectée avec succès après débannissement.")

    print("\n--- 6. TEST CHANGEMENT DE RÔLE ---")
    role_res = change_user_role(
        user_id=alice_user.user_id,
        req=ChangeRoleRequest(role="admin"),
        db=db,
        current_admin=prof_user,
    )
    assert role_res.role == "admin"
    print(f"Alice promue : {role_res.message}")

    print("\n--- 7. TEST STATISTIQUES & RÉTENTION (ANALYTICS) ---")
    overview = get_overview_stats(db=db, current_admin=prof_user)
    print(f"Stats Overview : Total Users={overview.total_users}, Abandon={overview.global_abandon_rate}%")
    assert overview.total_users == 2

    games_st = get_games_stats(db=db, current_admin=prof_user)
    print(f"Stats Games : {len(games_st)} jeux analysés")
    assert len(games_st) > 0

    retention_st = get_retention_stats(db=db, current_admin=prof_user)
    print(
        f"Stats Rétention : {len(retention_st.hourly_activity)}h, Temps={retention_st.total_time_played_hours}h"
    )
    assert len(retention_st.hourly_activity) == 24

    print("\n--- 8. TEST ENREGISTREMENT DE SESSION RÉELLE & LEADERBOARD ---")
    game_plongee = Game(
    module_id=1,
    name="Jeu de Plongée (R5.A.06)",
    data={},
    difficulty="hard",
    multiplayer_flag=True,)
    db.add(game_plongee)
    db.commit()

    # Alice joue et gagne
    rec1 = record_game_session(
        req=RecordGameSessionRequest(
            game_name="plongee",
            score=350,
            time_seconds=180,
            completed=True,
        ),
        db=db,
        current_user=alice_user,
    )
    assert rec1.success
    assert rec1.score == 350
    assert rec1.winner_flag is True
    print(f"Session réelle 1 enregistrée : {rec1.game_name}, score={rec1.score}, joueur={rec1.user_pseudo}")

    # Un invité joue et ragequit (<60s)
    rec2 = record_game_session(
        req=RecordGameSessionRequest(
            game_name="plongee",
            score=50,
            time_seconds=40,
            completed=False,
            status="abandoned",
        ),
        db=db,
        current_user=None,
    )
    assert rec2.success
    assert rec2.winner_flag is False
    print(f"Session réelle 2 (invité abandon) : score={rec2.score}, joueur={rec2.user_pseudo}")

    # Leaderboard réel
    lb = get_leaderboard("plongee", db=db)
    print(f"Leaderboard réel : {len(lb.scores)} entrées")
    assert len(lb.scores) == 2
    assert lb.scores[0].pseudo == "alice"
    assert lb.scores[0].score == 350

    # Vérification que get_games_stats reflète les vraies parties
    games_after = get_games_stats(db=db, current_admin=prof_user)
    plongee_stat = next(g for g in games_after if "Plongée" in g.game_name)
    print(
        f"Stats jeu réelles : Jouées={plongee_stat.total_played}, "
        f"Finies={plongee_stat.completed}, Abandons={plongee_stat.abandoned} ({plongee_stat.abandon_rate}%)"
    )
    assert plongee_stat.total_played == 2
    assert plongee_stat.completed == 1
    assert plongee_stat.abandoned == 1
    assert plongee_stat.abandon_rate == 50.0

    db.close()

    print("\n✅ TOUS LES TESTS BACKEND SONT PASSÉS AVEC SUCCÈS !")


if __name__ == "__main__":
    run_tests()
