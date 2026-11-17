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
from models.user import User, UserSetting
from routers.admin import change_user_role, list_users, toggle_ban_user
from routers.auth import login, register
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

    db.close()

    print("\n✅ TOUS LES TESTS BACKEND SONT PASSÉS AVEC SUCCÈS !")


if __name__ == "__main__":
    run_tests()
