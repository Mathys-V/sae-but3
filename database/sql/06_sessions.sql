-- =============================================================
-- FICHIER : sql/06_sessions.sql
-- But : salons de jeu où toute partie, même solo, a son salon.
-- =============================================================

DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    host_id INTEGER NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,    -- créateur du salon
    status VARCHAR(20) NOT NULL DEFAULT 'waiting'
        CHECK (status IN ('waiting', 'in_progress', 'finished')),
    current_game_id  INTEGER     -- NULL au départ, jeu en cours ensuite
        REFERENCES games(game_id) ON DELETE SET NULL,
    invite_code VARCHAR(25) NOT NULL UNIQUE,    -- généré même en solo
    max_players SMALLINT NOT NULL
        CHECK (max_players BETWEEN 1 AND 4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);