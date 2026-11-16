-- =============================================================
-- FICHIER : sql/02_user_settings.sql
-- But : préférences de jeu du joueur (contrôles, mode daltonien).
-- =============================================================

DROP TABLE IF EXISTS user_settings CASCADE;

CREATE TABLE user_settings (
    user_setting_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE
        REFERENCES users(user_id) ON DELETE CASCADE,
    control_scheme VARCHAR(20) NOT NULL DEFAULT 'arrows'
        CHECK (control_scheme IN ('arrows', 'letters', 'zqsd')),
    colorblind_flag BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
