-- =============================================================
-- FICHIER : sql/10_achievements.sql
-- But : catalogue des succès (condition JSONB, jeu concerné facultatif).
-- =============================================================

DROP TABLE IF EXISTS achievements CASCADE;

CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    game_id INTEGER
        REFERENCES games(game_id) ON DELETE CASCADE,
    unlock_condition JSONB NOT NULL,
    icon_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by INTEGER
        REFERENCES users(user_id) ON DELETE SET NULL,
    last_modified_by INTEGER
        REFERENCES users(user_id) ON DELETE SET NULL
);
