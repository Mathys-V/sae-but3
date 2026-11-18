-- =============================================================
-- FICHIER : sql/seed.sql
-- But : données de démonstration pour le développement et les tests.
-- ⚠️ DÉVELOPPEMENT UNIQUEMENT — ne jamais exécuter en production.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Joueurs (users)
-- -------------------------------------------------------------
-- Mot de passe démo 'admin123' pour prof, 'alice123' pour alice, 'azerty123' pour les autres
INSERT INTO users (pseudo, email, password_hash, role, banned_flag, created_at, updated_at, last_login) VALUES
    ('alice',  'alice@etu.univ.fr',  '$2b$12$swbvMXP6wJa1EqvCCDtCgeY7xXi9zhFjoNBad21Kp5MnN7HJfQvNe',   'player', FALSE, NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day',  NOW() - INTERVAL '2 hours'),
    ('bob',    'bob@etu.univ.fr',    '$2b$12$6izyXBay9/GqjFhp2IQyZOmzf6WCLnRZiyIMu.H.DP9mZsXefZo5a',     'player', FALSE, NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days'),
    ('chloe',  'chloe@etu.univ.fr',  '$2b$12$NBR/TrDhcvZHG6ulMtSvRO1jO2Qw.63qEyfmr5M6h.jTiillDl81',   'player', FALSE, NOW() - INTERVAL '10 days', NULL,                    NOW() - INTERVAL '1 hour'),
    ('damien', 'damien@etu.univ.fr', '$2b$12$sjIi6QYKPsh7pgJFuSe/feHzZkcEi6RqTu6cKdr1Frg9dJ.q9Hll.',  'player', FALSE, NOW() - INTERVAL '8 days',  NULL,                    NOW() - INTERVAL '6 hours'),
    ('prof',   'prof@univ.fr',       '$2b$12$LtF5Fv4mb2RqqZgvAYOWIuzpuvgfcXxoiWi/ExaeLQjMHPndNg.32',    'admin',  FALSE, NOW() - INTERVAL '60 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '30 min'),
    ('troll',  'troll@etu.univ.fr',  '$2b$12$OeFBK0VGor.GIRJc/Kt7JeSR9KdlV65x4130mgx0tp6EnaURjR.OK',   'player', TRUE,  NOW() - INTERVAL '10 days', NULL,                    NULL);

-- -------------------------------------------------------------
-- 2. Préférences (user_settings) — création lazy : 2 joueurs sur 6
-- -------------------------------------------------------------
INSERT INTO user_settings (user_id, control_scheme, colorblind_flag)
SELECT user_id, 'zqsd', TRUE FROM users WHERE pseudo = 'alice';

INSERT INTO user_settings (user_id, control_scheme, colorblind_flag)
SELECT user_id, 'arrows', FALSE FROM users WHERE pseudo = 'bob';
-- chloe, damien, prof et troll : aucune ligne, les valeurs par défaut
-- peuvent être appliquées par l'application lors de la première utilisation.

-- -------------------------------------------------------------
-- 3. Modules (modules)
-- -------------------------------------------------------------
INSERT INTO modules (
    name, description, cursus_year, image_url, by_default_flag,
    created_at, updated_at, created_by, last_modified_by
)
SELECT v.name, v.description, v.cursus_year, v.image_url, v.by_default_flag,
       v.created_at, v.updated_at, admin.user_id, admin.user_id
FROM (VALUES
    ('Bases de Python', 'Variables, conditions, boucles', 1::SMALLINT, '/assets/modules/but1.png', TRUE,  NOW() - INTERVAL '40 days', NOW() - INTERVAL '5 days'),
    ('R4.1 : Programmation', 'Structures de données et algorithmes', 2::SMALLINT, '/assets/modules/but2.png', TRUE, NOW() - INTERVAL '35 days', NOW() - INTERVAL '4 days'),
    ('Systèmes et réseaux', 'Bases des réseaux informatiques', 2::SMALLINT, '/assets/modules/but2-reseaux.png', FALSE, NOW() - INTERVAL '30 days', NULL::TIMESTAMPTZ),
    ('Projet final', 'Synthèse et mise en œuvre', 3::SMALLINT, '/assets/modules/but3.png', FALSE, NOW() - INTERVAL '20 days', NULL::TIMESTAMPTZ),
    ('Tutoriel EvilJV', 'Prise en main d''Evil MescoursJV et règles du jeu', 1::SMALLINT, '/assets/icons/book.png', TRUE, NOW() - INTERVAL '30 days', NULL::TIMESTAMPTZ),
    ('R1.06 : Mathématiques discrètes', 'Probabilités, logique et combinatoire', 1::SMALLINT, '/assets/treasurebg.jpg', FALSE, NOW() - INTERVAL '30 days', NULL::TIMESTAMPTZ),
    ('R5.A.06 : Programmation multimédia', 'Moteur Kaplay, animations de sprites et physique aquatique', 3::SMALLINT, '/assets/plongee/env/backgrounds/surface_ocean_jour.png', FALSE, NOW() - INTERVAL '25 days', NULL::TIMESTAMPTZ)
) AS v(name, description, cursus_year, image_url, by_default_flag, created_at, updated_at)
CROSS JOIN users AS admin
WHERE admin.pseudo = 'prof';

-- -------------------------------------------------------------
-- 4. Jeux (games) — plusieurs jeux pour illustrer les relations
-- -------------------------------------------------------------
INSERT INTO games (
    module_id, name, description, data, difficulty, config,
    multiplayer_flag, min_players, max_players, active_flag,
    created_at, updated_at, created_by, last_modified_by
)
SELECT m.module_id, v.name, v.description, v.data::JSONB, v.difficulty, v.config::JSONB,
       v.multiplayer_flag, v.min_players, v.max_players, v.active_flag,
       v.created_at, v.updated_at, admin.user_id, admin.user_id
FROM (VALUES
    (
        'Bases de Python',
        'Quiz Variables',
        'Choisissez la bonne réponse.',
        '{"questions":[{"id":1,"question":"Que vaut x après x = 5 ; x += 3 ?","choices":["3","8","5"],"correct_choice":1},{"id":2,"question":"Quel type pour un texte ?","choices":["int","str","bool"],"correct_choice":1},{"id":3,"question":"Que fait len(''bonjour'') ?","choices":["6","7","8"],"correct_choice":1}]}' ,
        'easy',
        '{"time_per_question":20,"points_per_correct":50,"penalty_wrong":10,"max_possible":150}',
        FALSE, 1::SMALLINT, 1::SMALLINT, TRUE,
        LOCALTIMESTAMP - INTERVAL '35 days', LOCALTIMESTAMP - INTERVAL '3 days'
    ),
    (
        'Bases de Python',
        'Duck Hunt',
        'Attrapez les canards et évitez les obstacles !',
        '{"levels":[{"id":1,"ducks":5,"obstacles":[]},{"id":2,"ducks":8,"obstacles":["nuage"]}]}',
        'medium',
        '{"points_per_duck":40,"penalty_obstacle_hit":25,"max_possible":400}',
        TRUE, 1::SMALLINT, 4::SMALLINT, TRUE,
        LOCALTIMESTAMP - INTERVAL '32 days', LOCALTIMESTAMP - INTERVAL '2 days'
    ),
    (
        'R4.1 : Programmation',
        'Quiz Structures',
        'Questions sur les listes et les dictionnaires.',
        '{"questions":[{"id":1,"question":"Quel est le type de [1, 2, 3] ?","choices":["tuple","list","set"],"correct_choice":1}]}',
        'medium',
        '{"time_per_question":25,"points_per_correct":50,"max_possible":50}',
        TRUE, 2::SMALLINT, 4::SMALLINT, FALSE,
        LOCALTIMESTAMP - INTERVAL '28 days', LOCALTIMESTAMP - INTERVAL '1 day'
    ),
    (
        'Projet final',
        'Boss Final',
        'Le grand quiz de synthèse.',
        '{"questions":[{"id":1,"question":"Prêt ?","choices":["Oui","Non"],"correct_choice":0}]}',
        'hard',
        '{"time_per_question":10,"points_per_correct":100,"max_possible":100}',
        FALSE, 1::SMALLINT, 1::SMALLINT, TRUE,
        LOCALTIMESTAMP - INTERVAL '15 days', NULL::TIMESTAMPTZ
    ),
    (
        'Tutoriel EvilJV',
        'Tutoriel EvilJV',
        'Tutoriel interactif pour maîtriser les mécaniques d''Evil MescoursJV et les contrôles.',
        '{"steps":[{"id":1,"title":"Bienvenue"},{"id":2,"title":"Bouton secret"},{"id":3,"title":"Contrôles"}]}',
        'easy',
        '{"time_limit":120,"points_per_step":25,"max_possible":100}',
        FALSE, 1::SMALLINT, 1::SMALLINT, TRUE,
        LOCALTIMESTAMP - INTERVAL '30 days', NULL::TIMESTAMPTZ
    ),
    (
        'R1.06 : Mathématiques discrètes',
        'Casino Mathématique (R1.06)',
        'Bandit manchot et défis de calculs de probabilités sur les combinaisons et les gains.',
        '{"reels":3,"symbols":["7","BAR","CHERRY","COIN","SKULL"]}',
        'medium',
        '{"initial_coins":100,"cost_per_spin":10,"max_possible":2000}',
        FALSE, 1::SMALLINT, 1::SMALLINT, TRUE,
        LOCALTIMESTAMP - INTERVAL '28 days', NULL::TIMESTAMPTZ
    ),
    (
        'R5.A.06 : Programmation multimédia',
        'Jeu de Plongée (R5.A.06)',
        'Exploration sous-marine périlleuse : collectez des perles, gérez votre oxygène et évitez les monstres marins.',
        '{"zones":["surface","ocean_jour","abysses"],"oxygen_max":100}',
        'hard',
        '{"oxygen_depletion_rate":2.5,"pearl_points":50,"relic_points":200,"max_possible":1000}',
        TRUE, 1::SMALLINT, 4::SMALLINT, TRUE,
        LOCALTIMESTAMP - INTERVAL '25 days', LOCALTIMESTAMP - INTERVAL '1 day'
    )
) AS v(module_name, name, description, data, difficulty, config,
       multiplayer_flag, min_players, max_players, active_flag, created_at, updated_at)
JOIN modules AS m ON m.name = v.module_name
CROSS JOIN users AS admin
WHERE admin.pseudo = 'prof';

-- -------------------------------------------------------------
-- 5. Progression (users_modules) — différents statuts représentés
-- -------------------------------------------------------------
INSERT INTO users_modules (user_id, module_id, status, attempts, best_score, best_time, date_completion)
SELECT u.user_id, m.module_id, 'completed', 4, 140, 55, NOW() - INTERVAL '20 days' + INTERVAL '1 min'
FROM users u JOIN modules m ON m.name = 'Bases de Python'
WHERE u.pseudo = 'alice';

INSERT INTO users_modules (user_id, module_id, status, attempts, best_score, best_time, date_completion)
SELECT u.user_id, m.module_id, 'in_progress', 2, 80, NULL, NULL
FROM users u JOIN modules m ON m.name = 'R4.1 : Programmation'
WHERE u.pseudo = 'alice';

INSERT INTO users_modules (user_id, module_id, status, attempts, best_score, best_time, date_completion)
SELECT u.user_id, m.module_id, 'completed', 2, 120, 70, NOW() - INTERVAL '5 days'
FROM users u JOIN modules m ON m.name = 'Bases de Python'
WHERE u.pseudo = 'bob';

INSERT INTO users_modules (user_id, module_id, status, attempts, best_score, best_time, date_completion)
SELECT u.user_id, m.module_id, 'in_progress', 1, NULL, NULL, NULL
FROM users u JOIN modules m ON m.name = 'R4.1 : Programmation'
WHERE u.pseudo = 'bob';

INSERT INTO users_modules (user_id, module_id, status, attempts, best_score, best_time, date_completion)
SELECT u.user_id, m.module_id, 'in_progress', 1, NULL, NULL, NULL
FROM users u JOIN modules m ON m.name = 'Bases de Python'
WHERE u.pseudo = 'chloe';

INSERT INTO users_modules (user_id, module_id, status, attempts, best_score, best_time, date_completion)
SELECT u.user_id, m.module_id, 'locked', 0, NULL, NULL, NULL
FROM users u JOIN modules m ON m.name = 'Bases de Python'
WHERE u.pseudo = 'damien';

-- -------------------------------------------------------------
-- 6. Salons (sessions) — solo terminé, multi en cours, attente, multi terminé
-- -------------------------------------------------------------
INSERT INTO sessions (host_id, status, current_game_id, invite_code, max_players, created_at, ended_at)
SELECT u.user_id, 'finished', g.game_id, 'SOLO01', 1,
       NOW() - INTERVAL '25 days', NOW() - INTERVAL '20 days' + INTERVAL '4 min'
FROM users u CROSS JOIN games g
WHERE u.pseudo = 'alice' AND g.name = 'Quiz Variables';

INSERT INTO sessions (host_id, status, current_game_id, invite_code, max_players, created_at)
SELECT u.user_id, 'in_progress', g.game_id, 'PARTY8', 4, NOW() - INTERVAL '30 min'
FROM users u CROSS JOIN games g
WHERE u.pseudo = 'alice' AND g.name = 'Duck Hunt';

INSERT INTO sessions (host_id, status, current_game_id, invite_code, max_players, created_at)
SELECT u.user_id, 'waiting', NULL, 'LOBBY2', 2, NOW() - INTERVAL '2 min'
FROM users u
WHERE u.pseudo = 'chloe';

INSERT INTO sessions (host_id, status, current_game_id, invite_code, max_players, created_at, ended_at)
SELECT u.user_id, 'finished', g.game_id, 'RESULTS1', 4,
       NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '8 min'
FROM users u CROSS JOIN games g
WHERE u.pseudo = 'bob' AND g.name = 'Duck Hunt';

-- -------------------------------------------------------------
-- 7. Présence (sessions_users)
-- -------------------------------------------------------------
INSERT INTO sessions_users (session_id, user_id, role, ready_flag, connected_flag, joined_at, left_at)
SELECT s.session_id, u.user_id, 'host', TRUE, FALSE,
       NOW() - INTERVAL '25 days', NOW() - INTERVAL '20 days' + INTERVAL '4 min'
FROM sessions s CROSS JOIN users u
WHERE s.invite_code = 'SOLO01' AND u.pseudo = 'alice';

INSERT INTO sessions_users (session_id, user_id, role, ready_flag, connected_flag, joined_at)
SELECT s.session_id, u.user_id, 'host', TRUE, TRUE, NOW() - INTERVAL '30 min'
FROM sessions s CROSS JOIN users u
WHERE s.invite_code = 'PARTY8' AND u.pseudo = 'alice';

INSERT INTO sessions_users (session_id, user_id, role, ready_flag, connected_flag, joined_at)
SELECT s.session_id, u.user_id, 'player', TRUE, TRUE, NOW() - INTERVAL '28 min'
FROM sessions s CROSS JOIN users u
WHERE s.invite_code = 'PARTY8' AND u.pseudo = 'bob';

INSERT INTO sessions_users (session_id, user_id, role, ready_flag, connected_flag, joined_at)
SELECT s.session_id, u.user_id, 'player', FALSE, TRUE, NOW() - INTERVAL '25 min'
FROM sessions s CROSS JOIN users u
WHERE s.invite_code = 'PARTY8' AND u.pseudo = 'chloe';

INSERT INTO sessions_users (session_id, user_id, role, ready_flag, connected_flag, joined_at, left_at)
SELECT s.session_id, u.user_id, 'player', TRUE, FALSE, NOW() - INTERVAL '20 min', NOW() - INTERVAL '5 min'
FROM sessions s CROSS JOIN users u
WHERE s.invite_code = 'PARTY8' AND u.pseudo = 'damien';

-- Salon multi terminé : Bob gagne, Chloé perd.
INSERT INTO sessions_users (session_id, user_id, role, ready_flag, connected_flag, joined_at, left_at)
SELECT s.session_id, u.user_id, 'host', TRUE, FALSE, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '8 min'
FROM sessions s CROSS JOIN users u
WHERE s.invite_code = 'RESULTS1' AND u.pseudo = 'bob';

INSERT INTO sessions_users (session_id, user_id, role, ready_flag, connected_flag, joined_at, left_at)
SELECT s.session_id, u.user_id, 'player', TRUE, FALSE, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '8 min'
FROM sessions s CROSS JOIN users u
WHERE s.invite_code = 'RESULTS1' AND u.pseudo = 'chloe';

INSERT INTO sessions_users (session_id, user_id, role, ready_flag, connected_flag, joined_at)
SELECT s.session_id, u.user_id, 'host', TRUE, TRUE, s.created_at
FROM sessions s CROSS JOIN users u
WHERE s.invite_code = 'LOBBY2' AND u.pseudo = 'chloe';

-- -------------------------------------------------------------
-- 8. Coups (moves) — historique solo et extraits du multi
-- -------------------------------------------------------------
INSERT INTO moves (session_id, game_id, user_id, move_data, created_at)
SELECT s.session_id, g.game_id, u.user_id,
       '{"type":"answer","question":1,"choice":1,"correct":true,"time_ms":4200}',
       NOW() - INTERVAL '25 days' + INTERVAL '1 min'
FROM sessions s CROSS JOIN games g CROSS JOIN users u
WHERE s.invite_code = 'SOLO01' AND g.name = 'Quiz Variables' AND u.pseudo = 'alice';

INSERT INTO moves (session_id, game_id, user_id, move_data, created_at)
SELECT s.session_id, g.game_id, u.user_id,
       '{"type":"answer","question":2,"choice":0,"correct":false,"time_ms":19000}',
       NOW() - INTERVAL '25 days' + INTERVAL '2 min'
FROM sessions s CROSS JOIN games g CROSS JOIN users u
WHERE s.invite_code = 'SOLO01' AND g.name = 'Quiz Variables' AND u.pseudo = 'alice';

INSERT INTO moves (session_id, game_id, user_id, move_data, created_at)
SELECT s.session_id, g.game_id, u.user_id,
       '{"type":"answer","question":3,"choice":1,"correct":true,"time_ms":3100}',
       NOW() - INTERVAL '25 days' + INTERVAL '3 min'
FROM sessions s CROSS JOIN games g CROSS JOIN users u
WHERE s.invite_code = 'SOLO01' AND g.name = 'Quiz Variables' AND u.pseudo = 'alice';

INSERT INTO moves (session_id, game_id, user_id, move_data, created_at)
SELECT s.session_id, g.game_id, u.user_id,
       '{"type":"hit","target":"duck","level":1}',
       NOW() - INTERVAL '15 min'
FROM sessions s CROSS JOIN games g CROSS JOIN users u
WHERE s.invite_code = 'PARTY8' AND g.name = 'Duck Hunt' AND u.pseudo = 'alice';

INSERT INTO moves (session_id, game_id, user_id, move_data, created_at)
SELECT s.session_id, g.game_id, u.user_id,
       '{"type":"hit","target":"obstacle","level":1}',
       NOW() - INTERVAL '14 min'
FROM sessions s CROSS JOIN games g CROSS JOIN users u
WHERE s.invite_code = 'PARTY8' AND g.name = 'Duck Hunt' AND u.pseudo = 'bob';

INSERT INTO moves (session_id, game_id, user_id, move_data, created_at)
SELECT s.session_id, g.game_id, u.user_id,
       '{"type":"hit","target":"duck","level":2}',
       NOW() - INTERVAL '5 days' + INTERVAL '3 min'
FROM sessions s CROSS JOIN games g CROSS JOIN users u
WHERE s.invite_code = 'RESULTS1' AND g.name = 'Duck Hunt' AND u.pseudo = 'bob';

-- -------------------------------------------------------------
-- 9. Scores (scores) — tentatives solo et résultats multi
-- -------------------------------------------------------------
INSERT INTO scores (user_id, game_id, session_id, score, time, winner_flag, created_at)
SELECT u.user_id, g.game_id, s.session_id, 80, 120, TRUE, NOW() - INTERVAL '25 days' + INTERVAL '2 min'
FROM users u CROSS JOIN games g CROSS JOIN sessions s
WHERE u.pseudo = 'alice' AND g.name = 'Quiz Variables' AND s.invite_code = 'SOLO01';

INSERT INTO scores (user_id, game_id, session_id, score, time, winner_flag, created_at)
SELECT u.user_id, g.game_id, s.session_id, 110, 90, TRUE, NOW() - INTERVAL '22 days'
FROM users u CROSS JOIN games g CROSS JOIN sessions s
WHERE u.pseudo = 'alice' AND g.name = 'Quiz Variables' AND s.invite_code = 'SOLO01';

INSERT INTO scores (user_id, game_id, session_id, score, time, winner_flag, created_at)
SELECT u.user_id, g.game_id, s.session_id, 140, 55, TRUE, NOW() - INTERVAL '20 days' + INTERVAL '1 min'
FROM users u CROSS JOIN games g CROSS JOIN sessions s
WHERE u.pseudo = 'alice' AND g.name = 'Quiz Variables' AND s.invite_code = 'SOLO01';

INSERT INTO scores (user_id, game_id, session_id, score, time, winner_flag, created_at)
SELECT u.user_id, g.game_id, s.session_id, 120, 70, TRUE, NOW() - INTERVAL '5 days'
FROM users u CROSS JOIN games g CROSS JOIN sessions s
WHERE u.pseudo = 'bob' AND g.name = 'Duck Hunt' AND s.invite_code = 'RESULTS1';

INSERT INTO scores (user_id, game_id, session_id, score, time, winner_flag, created_at)
SELECT u.user_id, g.game_id, s.session_id, 50, 180, FALSE, NOW() - INTERVAL '5 days'
FROM users u CROSS JOIN games g CROSS JOIN sessions s
WHERE u.pseudo = 'chloe' AND g.name = 'Duck Hunt' AND s.invite_code = 'RESULTS1';

-- -------------------------------------------------------------
-- 10. Succès (achievements) — globaux ET liés à un jeu
-- -------------------------------------------------------------
INSERT INTO achievements (
    name, description, game_id, unlock_condition, icon_url,
    created_at, updated_at, created_by, last_modified_by
)
SELECT v.name, v.description, NULL, v.unlock_condition::JSONB, v.icon_url,
       v.created_at, v.updated_at, admin.user_id, admin.user_id
FROM (VALUES
    ('Première victoire', 'Gagner votre première partie', '{"type":"stat","stat_key":"victories","value":1}', '/assets/badges/first.png', NOW() - INTERVAL '30 days', NOW() - INTERVAL '2 days'),
    ('Maître du Quiz', 'Réussir 10 quiz sans faute', '{"type":"stat","stat_key":"quizzes_perfect","value":10}', '/assets/badges/quiz.png', NOW() - INTERVAL '25 days', NULL::TIMESTAMPTZ),
    ('Sociable', 'Jouer 5 parties en salon multi', '{"type":"stat","stat_key":"multi_games","value":5}', '/assets/badges/party.png', NOW() - INTERVAL '20 days', NULL::TIMESTAMPTZ)
) AS v(name, description, unlock_condition, icon_url, created_at, updated_at)
CROSS JOIN users AS admin
WHERE admin.pseudo = 'prof';

INSERT INTO achievements (
    name, description, game_id, unlock_condition, icon_url,
    created_at, updated_at, created_by, last_modified_by
)
SELECT 'Chasseur de canards', 'Trouver 12 canards', g.game_id,
       '{"type":"stat","stat_key":"ducks_found","value":12}'::JSONB,
       '/assets/badges/duck.png', NOW() - INTERVAL '18 days', NOW() - INTERVAL '1 day',
       admin.user_id, admin.user_id
FROM games g CROSS JOIN users admin
WHERE g.name = 'Duck Hunt' AND admin.pseudo = 'prof';

INSERT INTO achievements (
    name, description, game_id, unlock_condition, icon_url,
    created_at, updated_at, created_by, last_modified_by
)
SELECT 'Plongeur des Abysses', 'Explorer les profondeurs marines et remonter vivant', g.game_id,
       '{"type":"score","min_score":300}'::JSONB,
       '/assets/icons/medal.png', NOW() - INTERVAL '20 days', NULL::TIMESTAMPTZ,
       admin.user_id, admin.user_id
FROM games g CROSS JOIN users admin
WHERE g.name = 'Jeu de Plongée (R5.A.06)' AND admin.pseudo = 'prof';

INSERT INTO achievements (
    name, description, game_id, unlock_condition, icon_url,
    created_at, updated_at, created_by, last_modified_by
)
SELECT 'Flamheur Fou', 'Remporter plus de 1000 pièces au Casino Mathématique', g.game_id,
       '{"type":"score","min_score":1000}'::JSONB,
       '/assets/icons/coin_stack.png', NOW() - INTERVAL '20 days', NULL::TIMESTAMPTZ,
       admin.user_id, admin.user_id
FROM games g CROSS JOIN users admin
WHERE g.name = 'Casino Mathématique (R1.06)' AND admin.pseudo = 'prof';

INSERT INTO achievements (
    name, description, game_id, unlock_condition, icon_url,
    created_at, updated_at, created_by, last_modified_by
)
SELECT 'Initié d''EvilJV', 'Valider avec succès le tutoriel d''Evil MescoursJV', g.game_id,
       '{"type":"tutorial_completed","value":true}'::JSONB,
       '/assets/icons/book.png', NOW() - INTERVAL '25 days', NULL::TIMESTAMPTZ,
       admin.user_id, admin.user_id
FROM games g CROSS JOIN users admin
WHERE g.name = 'Tutoriel EvilJV' AND admin.pseudo = 'prof';

-- -------------------------------------------------------------
-- 11. Succès débloqués (users_achievements)
-- -------------------------------------------------------------
INSERT INTO users_achievements (user_id, achievement_id, unlocked_at)
SELECT u.user_id, a.achievement_id, NOW() - INTERVAL '25 days'
FROM users u CROSS JOIN achievements a
WHERE u.pseudo = 'alice' AND a.name = 'Première victoire';

INSERT INTO users_achievements (user_id, achievement_id, unlocked_at)
SELECT u.user_id, a.achievement_id, NOW() - INTERVAL '15 days'
FROM users u CROSS JOIN achievements a
WHERE u.pseudo = 'alice' AND a.name = 'Chasseur de canards';

INSERT INTO users_achievements (user_id, achievement_id, unlocked_at)
SELECT u.user_id, a.achievement_id, NOW() - INTERVAL '5 days'
FROM users u CROSS JOIN achievements a
WHERE u.pseudo = 'bob' AND a.name = 'Première victoire';
-- Chloé et Damien n'ont pas encore débloqué de succès.

-- -------------------------------------------------------------
-- 12. Statistiques (user_stats)
-- -------------------------------------------------------------
INSERT INTO user_stats (user_id, stat_key, stat_value) VALUES
    ((SELECT user_id FROM users WHERE pseudo = 'alice'), 'ducks_found', 15),
    ((SELECT user_id FROM users WHERE pseudo = 'alice'), 'games_played', 6),
    ((SELECT user_id FROM users WHERE pseudo = 'alice'), 'victories', 4),
    ((SELECT user_id FROM users WHERE pseudo = 'alice'), 'quizzes_perfect', 2),
    ((SELECT user_id FROM users WHERE pseudo = 'alice'), 'multi_games', 3),
    ((SELECT user_id FROM users WHERE pseudo = 'bob'), 'games_played', 2),
    ((SELECT user_id FROM users WHERE pseudo = 'bob'), 'victories', 1),
    ((SELECT user_id FROM users WHERE pseudo = 'bob'), 'ducks_found', 8),
    ((SELECT user_id FROM users WHERE pseudo = 'chloe'), 'games_played', 2),
    ((SELECT user_id FROM users WHERE pseudo = 'chloe'), 'victories', 0),
    ((SELECT user_id FROM users WHERE pseudo = 'damien'), 'games_played', 1);

-- -------------------------------------------------------------
-- 13. Notifications (notifications) — système + invitations
-- -------------------------------------------------------------
INSERT INTO notifications (user_id, sender_id, session_id, type, message, created_at, updated_at)
SELECT u.user_id, NULL, NULL, 'achievement_unlocked',
       'Bravo Bob : succès "Première victoire" débloqué !',
       NOW() - INTERVAL '5 days', NULL
FROM users u WHERE u.pseudo = 'bob';

INSERT INTO notifications (user_id, sender_id, session_id, type, message, created_at)
SELECT recipient.user_id, sender.user_id, s.session_id, 'party_invite',
       'Alice vous invite à rejoindre son salon (code PARTY8).',
       NOW() - INTERVAL '30 min'
FROM users recipient
CROSS JOIN users sender
CROSS JOIN sessions s
WHERE recipient.pseudo = 'bob' AND sender.pseudo = 'alice' AND s.invite_code = 'PARTY8';

INSERT INTO notifications (user_id, sender_id, session_id, type, message, created_at)
SELECT recipient.user_id, sender.user_id, s.session_id, 'party_invite',
       'Alice vous invite à rejoindre son salon (code PARTY8).',
       NOW() - INTERVAL '25 min'
FROM users recipient
CROSS JOIN users sender
CROSS JOIN sessions s
WHERE recipient.pseudo = 'damien' AND sender.pseudo = 'alice' AND s.invite_code = 'PARTY8';

INSERT INTO notifications (user_id, sender_id, session_id, type, message, created_at)
SELECT u.user_id, NULL, NULL, 'info', 'Bienvenue sur la plateforme !',
       NOW() - INTERVAL '30 days'
FROM users u WHERE u.pseudo = 'alice';

-- -------------------------------------------------------------
-- 14. Profils utilisateurs (user_profiles) — données ajoutées
-- -------------------------------------------------------------
INSERT INTO user_profiles (
    user_id, avatar_url, totem_animal, totem_object,
    totem_city, totem_dish, totem_monument, created_at, updated_at
)
SELECT u.user_id, v.avatar_url, v.totem_animal, v.totem_object,
       v.totem_city, v.totem_dish, v.totem_monument, v.created_at, v.updated_at
FROM (VALUES
    ('alice',  '/assets/avatars/alice.png',  'Renard', 'Carnet', 'Amiens', 'Gaufre', 'Tour Perret', NOW() - INTERVAL '29 days', NOW() - INTERVAL '2 days'),
    ('bob',    '/assets/avatars/bob.png',    'Loup', 'Manette', 'Lille', 'Carbonnade', 'Beffroi', NOW() - INTERVAL '24 days', NULL::TIMESTAMPTZ),
    ('chloe',  '/assets/avatars/chloe.png',  'Chat', 'Livre', 'Lyon', 'Tarte aux pralines', 'Basilique de Fourvière', NOW() - INTERVAL '9 days', NULL::TIMESTAMPTZ),
    ('damien', '/assets/avatars/damien.png', 'Aigle', 'Casque', 'Rouen', 'Teurgoule', 'Cathédrale de Rouen', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day'),
    ('prof',   '/assets/avatars/prof.png',   'Hibou', 'Plume', 'Paris', 'Croissant', 'Tour Eiffel', NOW() - INTERVAL '59 days', NULL::TIMESTAMPTZ),
    ('troll',  '/assets/avatars/troll.png',  'Corbeau', 'Masque', 'Marseille', 'Navette', 'Notre-Dame-de-la-Garde', NOW() - INTERVAL '9 days', NULL::TIMESTAMPTZ)
) AS v(pseudo, avatar_url, totem_animal, totem_object, totem_city, totem_dish, totem_monument, created_at, updated_at)
JOIN users u ON u.pseudo = v.pseudo;

-- =============================================================
-- FIN DU SEED
-- =============================================================
