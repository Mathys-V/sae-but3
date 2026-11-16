-- =============================================================
-- FICHIER : sql/05_users_modules.sql
-- But : progression d'un joueur dans un module (statut, meilleurs scores).
-- =============================================================

DROP TABLE IF EXISTS users_modules CASCADE;

CREATE TABLE users_modules (
    user_module_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL
        REFERENCES modules(module_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('locked', 'in_progress', 'completed')),
    attempts INTEGER NOT NULL DEFAULT 0,
    best_score INTEGER,    
    best_time INTEGER,
    date_completion TIMESTAMPTZ,  
    UNIQUE (user_id, module_id) -- un couple joueur-module unique
);