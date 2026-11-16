-- =============================================================
-- FICHIER : sql/08_moves.sql
-- But : historique des coups joués.
-- =============================================================

DROP TABLE IF EXISTS moves CASCADE;

CREATE TABLE moves (
    move_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL
        REFERENCES sessions(session_id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL
        REFERENCES games(game_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,
    move_data JSONB NOT NULL, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX index_moves_session ON moves (session_id);          -- rejouer/observer une partie
CREATE INDEX index_moves_user_game ON moves (user_id, game_id);  -- audit des coups d'un joueur
