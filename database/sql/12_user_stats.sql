-- =============================================================
-- FICHIER : sql/12_user_stats.sql
-- But : compteurs des statisitques joueurs nécessaires pour débloquer les achievements.
-- =============================================================

DROP TABLE IF EXISTS user_stats CASCADE;

CREATE TABLE user_stats (
    user_stat_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,
    stat_key VARCHAR(50) NOT NULL,        -- ex : ducks_found, games_played
    stat_value INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, stat_key)        -- un compteur par couple joueur-stat
);