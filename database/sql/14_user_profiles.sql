-- =============================================================
-- FICHIER : sql/14_user_profiles.sql
-- But : personnalisation du compte
-- =============================================================

DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
    user_profile_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE 
		REFERENCES users(user_id) ON DELETE CASCADE,
    avatar_url VARCHAR(255),
    totem_animal VARCHAR(50),
    totem_object VARCHAR(50),
    totem_city VARCHAR(50),
    totem_dish VARCHAR(50),
    totem_monument VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);