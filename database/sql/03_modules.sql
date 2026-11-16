-- =============================================================
-- FICHIER : sql/03_modules.sql
-- But : modules du cursus BUT (1, 2 ou 3).
-- =============================================================

DROP TABLE IF EXISTS modules CASCADE;

CREATE TABLE modules (
    module_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cursus_year SMALLINT NOT NULL
        CHECK (cursus_year BETWEEN 1 AND 3),
    image_url VARCHAR(255),
    by_default_flag BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by INTEGER
        REFERENCES users(user_id) ON DELETE SET NULL,
    last_modified_by INTEGER
        REFERENCES users(user_id) ON DELETE SET NULL
);
