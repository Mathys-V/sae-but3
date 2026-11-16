-- =============================================================
-- FICHIER : sql/13_notifications.sql
-- But : messages aux joueurs (invitations, succès, infos).
-- =============================================================

DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL     
        REFERENCES users(user_id) ON DELETE CASCADE,
    sender_id INTEGER      -- NULL = expédié par le système
        REFERENCES users(user_id) ON DELETE SET NULL,
    session_id INTEGER     -- NULL = non liée à un salon
        REFERENCES sessions(session_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, 
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);  -- boîte de réception