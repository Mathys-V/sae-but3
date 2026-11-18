-- =============================================================
-- FICHIER : sql/04_games.sql
-- But : mini-jeux rattachés aux modules (contenu data + règles config).
-- =============================================================

DROP TABLE IF EXISTS games CASCADE;

CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL
        REFERENCES modules(module_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    data JSONB NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'easy'
        CHECK (difficulty IN ('easy', 'medium', 'hard')),
    config JSONB,
    multiplayer_flag BOOLEAN NOT NULL DEFAULT FALSE,
    min_players SMALLINT NOT NULL DEFAULT 1
        CHECK (min_players BETWEEN 1 AND 4),
    max_players SMALLINT NOT NULL DEFAULT 1
        CHECK (max_players BETWEEN 1 AND 4),
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by INTEGER
        REFERENCES users(user_id) ON DELETE SET NULL,
    last_modified_by INTEGER
        REFERENCES users(user_id) ON DELETE SET NULL,
    CHECK (min_players <= max_players)

);
