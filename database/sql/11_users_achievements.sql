-- =============================================================
-- FICHIER : sql/11_users_achievements.sql
-- But : succès débloqués par les joueurs.
-- =============================================================

DROP TABLE IF EXISTS users_achievements CASCADE;

CREATE TABLE users_achievements (
    user_achievement_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL
        REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)  -- un succès n'est débloqué qu'une fois
);