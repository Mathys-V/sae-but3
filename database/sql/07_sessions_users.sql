-- =============================================================
-- FICHIER : sql/07_sessions_users.sql
-- But : présence des joueurs dans les salons (rôle, ready, connexion).
-- =============================================================

DROP TABLE IF EXISTS sessions_users CASCADE;

CREATE TABLE sessions_users (
    session_user_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL
        REFERENCES sessions(session_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'player'
        CHECK (role IN ('host', 'player')),
    ready_flag BOOLEAN NOT NULL DEFAULT FALSE,
    connected_flag BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    UNIQUE (session_id, user_id)
);
