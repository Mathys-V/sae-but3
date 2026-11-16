-- =============================================================
-- FICHIER : sql/01_users.sql
-- But : comptes joueurs (identité, authentification, rôle, bannissement)
-- =============================================================

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'player'
        CHECK (role IN ('player', 'admin')),
    banned_flag BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ
);
