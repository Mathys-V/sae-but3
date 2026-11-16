-- =============================================================
-- FICHIER : sql/09_scores.sql
-- But : historique des parties terminées (une ligne par partie).
-- =============================================================

DROP TABLE IF EXISTS scores CASCADE;

CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL
        REFERENCES games(game_id) ON DELETE CASCADE,
    session_id INTEGER NOT NULL
        REFERENCES sessions(session_id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    time INTEGER NOT NULL,
    winner_flag BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les classements
CREATE INDEX index_scores_game      -- classement d'un jeu
    ON scores (game_id, score DESC);

CREATE INDEX index_scores_user_game     -- meilleurs scores / score global
    ON scores (user_id, game_id, score DESC);
