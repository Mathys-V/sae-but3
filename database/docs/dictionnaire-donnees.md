# Distionnaire de données


## Table `users`

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `user_id` | SERIAL | PK | Identifiant unique du joueur |
| `pseudo` | VARCHAR(50) | NOT NULL, UNIQUE | Nom affiché, unique |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email, unique |
| `password_hash` | VARCHAR(255) | NOT NULL | Mot de passe haché (Argon2id), jamais en clair |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT `'player'`, CHECK (`player`, `admin`) | Rôle : `player` ou `admin` |
| `banned_flag` | BOOLEAN | NOT NULL, DEFAULT FALSE | Compte banni : TRUE = le joueur ne peut plus se connecter |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date de création du compte |
| `updated_at` | TIMESTAMPTZ | — | Dernière modification du profil |
| `last_login` | TIMESTAMPTZ | — | Dernière connexion |

## Table `user_settings`

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `user_setting_id` | SERIAL | PK | Identifiant des settings utilisateurs |
| `user_id` | INTEGER | NOT NULL, UNIQUE, FK → `users(user_id)` ON DELETE CASCADE | Joueur concerné (un seul jeu de réglages par joueur) |
| `control_scheme` | VARCHAR(20) | NOT NULL, DEFAULT `'arrows'`, CHECK (`arrows`, `letters`, `zqsd`) | Mode de contrôle : `arrows` (flèches), `letters` (lettres), `zqsd` |
| `colorblind_flag` | BOOLEAN | NOT NULL, DEFAULT FALSE | Mode daltonien activé (couleurs adaptées) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Dernière modification des préférences |

## Table `user_profiles`

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `user_profile_id` | SERIAL | PK | Identifiant des profils utilisateurs |
| `user_id` | INTEGER | NOT NULL, UNIQUE, FK → `users(user_id)` ON DELETE CASCADE | Joueur concerné (un seul profil par joueur) |
| `avatar_url` | VARCHAR(255) | — | URL de l'avatar choisi par l'utilisateur |
| `totem_animal` | VARCHAR(50) | — | Animal totem de l'utilisateur |
| `totem_object` | VARCHAR(50) | — | Objet du quotidien totem de l'utilisateur |
| `totem_city` | VARCHAR(50) | — | Ville totem de l'utilisateur |
| `totem_dish` | VARCHAR(50) | — | Plat totem de l'utilisateur |
| `totem_monument` | VARCHAR(50) | — | Monument totem de l'utilisateur |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date de création de la ligne |
| `updated_at` | TIMESTAMPTZ | — | Date de dernière modification de la ligne |

## Table `modules`

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `module_id` | SERIAL | PK | Identifiant du module |
| `name` | VARCHAR(100) | NOT NULL | Nom du module (ex : "R4.1 : Programmation") |
| `description` | TEXT | — | Description du module |
| `cursus_year` | SMALLINT | NOT NULL, CHECK (entre 1 et 3) | Année du BUT : 1, 2 ou 3 |
| `image_url` | VARCHAR(255) | — | Chemin de l'image affichée (ex : `/assets/modules/but1.png`) |
| `by_default_flag` | BOOLEAN | NOT NULL, DEFAULT FALSE | Module affiché par défaut au premier lancement |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date de création de la ligne |
| `updated_at` | TIMESTAMPTZ | — | Date de dernière modification de la ligne |
| `created_by` | INTEGER | FK → `users(user_id)` ON DELETE SET NULL | Compte utilisateur ayant créé la ligne |
| `last_modified_by` | INTEGER | FK → `users(user_id)` ON DELETE SET NULL | Compte utilisateur ayant fait la dernière modification |

## Table `games`

Contrainte de table : CHECK (min_players <= max_players)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `game_id` | SERIAL | PK | Identifiant du mini-jeu |
| `module_id` | INTEGER | NOT NULL, FK → `modules(module_id)` ON DELETE CASCADE | Module auquel appartient le jeu |
| `name` | VARCHAR(50) | NOT NULL | Nom du mini-jeu |
| `description` | TEXT | — | Consigne affichée au joueur |
| `data` | JSONB | NOT NULL | Contenu du jeu : questions, grille, obstacles... |
| `difficulty` | VARCHAR(20) | NOT NULL, DEFAULT `'easy'`, CHECK (`easy`, `medium`, `hard`) | Difficulté : `easy`, `medium`, `hard` |
| `config` | JSONB | — | Paramètres du template (temps par question, vies...) |
| `multiplayer_flag` | BOOLEAN | NOT NULL, DEFAULT FALSE | Jeu jouable à plusieurs |
| `min_players` | SMALLINT | NOT NULL, DEFAULT 1, CHECK (min_players BETWEEN 1 AND 4) | Nombre minimum de joueurs |
| `max_players` | SMALLINT, CHECK (max_players BETWEEN 1 AND 4) | NOT NULL, DEFAULT 1 | Nombre maximum de joueurs |
| `active_flag` | BOOLEAN | NOT NULL, DEFAULT TRUE | Jeu visible/jouable (permet de le retirer sans le supprimer) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | — | Dernière modification du contenu |
| `created_by` | INTEGER | FK → `users(user_id)` ON DELETE SET NULL | Compte utilisateur ayant créé la ligne |
| `last_modified_by` | INTEGER | FK → `users(user_id)` ON DELETE SET NULL | Compte utilisateur ayant fait la dernière modification |

## Table `users_modules`

Contrainte de table : `UNIQUE (user_id, module_id)` — un seul couple joueur-module.

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `user_module_id` | SERIAL | PK | Identifiant |
| `user_id` | INTEGER | NOT NULL, FK → `users(user_id)` ON DELETE CASCADE | Joueur concerné |
| `module_id` | INTEGER | NOT NULL, FK → `modules(module_id)` ON DELETE CASCADE | Module concerné |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT `'in_progress'`, CHECK (`locked`, `in_progress`, `completed`) | État : `locked`, `in_progress`, `completed` |
| `attempts` | INTEGER | NOT NULL, DEFAULT 0 | Nombre de tentatives du joueur sur ce module |
| `best_score` | INTEGER | — | Meilleur score |
| `best_time` | INTEGER | — | Meilleur temps en secondes |
| `date_completion` | TIMESTAMPTZ | — | Date de validation du module (NULL si pas terminé) |

## Table `moves`

Index :
- `index_moves_session` sur `(session_id)` — rejouer/observer une partie
- `index_moves_user_game` sur `(user_id, game_id)` — audit des coups d'un joueur

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `move_id` | SERIAL | PK | Identifiant du coup |
| `session_id` | INTEGER | NOT NULL, FK → `sessions(session_id)` ON DELETE CASCADE | Salon concerné |
| `game_id` | INTEGER | NOT NULL, FK → `games(game_id)` ON DELETE CASCADE | Jeu concerné |
| `user_id` | INTEGER | NOT NULL, FK → `users(user_id)` ON DELETE CASCADE | Joueur ayant joué |
| `move_data` | JSONB | NOT NULL | Détail du coup : `{"type": "answer", "question": 2, "choice": 1}` |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Moment du coup |

## Table `sessions`

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `session_id` | SERIAL | PK | Identifiant technique du salon |
| `host_id` | INTEGER | NOT NULL, FK → `users(user_id)` ON DELETE CASCADE | Créateur du salon |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT `'waiting'`, CHECK (`waiting`, `in_progress`, `finished`) | État : `waiting`, `in_progress`, `finished` |
| `current_game_id` | INTEGER | FK → `games(game_id)` ON DELETE SET NULL | Jeu en cours (NULL au départ, mis à jour à chaque jeu) |
| `invite_code` | VARCHAR(25) | NOT NULL, UNIQUE | Code d'invitation, unique (généré même en solo) |
| `max_players` | SMALLINT | NOT NULL, CHECK (entre 1 et 4) | Capacité max du salon (1 à 4) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date de création du salon |
| `ended_at` | TIMESTAMPTZ | — | Date de fin (NULL si en cours) |

## Table `sessions_users`

Contrainte de table : `UNIQUE (session_id, user_id)` — un joueur n'apparaît qu'une fois par salon.

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `session_user_id` | SERIAL | PK | Identifiant |
| `session_id` | INTEGER | NOT NULL, FK → `sessions(session_id)` ON DELETE CASCADE | Salon rejoint |
| `user_id` | INTEGER | NOT NULL, FK → `users(user_id)` ON DELETE CASCADE | Joueur |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT `'player'`, CHECK (`host`, `player`) | Rôle : `host`, `player` |
| `ready_flag` | BOOLEAN | NOT NULL, DEFAULT FALSE | Prêt à lancer la partie |
| `connected_flag` | BOOLEAN | NOT NULL, DEFAULT TRUE | Actuellement connecté |
| `joined_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date d'entrée dans le salon |
| `left_at` | TIMESTAMPTZ | — | Date de départ (NULL si toujours présent) |

## Table `scores`

Index :
- `index_scores_game` sur `(game_id, score DESC)` — classement d'un jeu
- `index_scores_user_game` sur `(user_id, game_id, score DESC)` — meilleurs scores / score global

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `score_id` | SERIAL | PK | Identifiant |
| `user_id` | INTEGER | NOT NULL, FK → `users(user_id)` ON DELETE CASCADE | Joueur |
| `game_id` | INTEGER | NOT NULL, FK → `games(game_id)` ON DELETE CASCADE | Jeu joué |
| `session_id` | INTEGER | NOT NULL, FK → `sessions(session_id)` ON DELETE CASCADE | Salon |
| `score` | INTEGER | NOT NULL | Points obtenus |
| `time` | INTEGER | NOT NULL | Durée de la partie en secondes |
| `winner_flag` | BOOLEAN | NOT NULL, DEFAULT FALSE | A gagné cette partie |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date du score |

## Table `achievements`

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `achievement_id` | SERIAL | PK | Identifiant |
| `name` | VARCHAR(100) | NOT NULL | Nom du succès (ex : "Maître du Quiz") |
| `description` | TEXT | — | Comment l'obtenir, affiché au joueur |
| `game_id` | INTEGER | FK → `games(game_id)` ON DELETE CASCADE | Jeu concerné (NULL = succès global) |
| `unlock_condition` | JSONB | NOT NULL | Condition de déblocage : `{"type": "victories", "value": 10}` |
| `icon_url` | VARCHAR(255) | — | Chemin de l'image du badge (ex : `/assets/badges/duck.png`) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date de création de la ligne |
| `updated_at` | TIMESTAMPTZ | — | Date de dernière modification de la ligne |
| `created_by` | INTEGER | FK → `users(user_id)` ON DELETE SET NULL | Compte utilisateur ayant créé la ligne |
| `last_modified_by` | INTEGER | FK → `users(user_id)` ON DELETE SET NULL | Compte utilisateur ayant fait la dernière modification |

## Table `users_achievements`

Contrainte de table : `UNIQUE (user_id, achievement_id)` — un succès n'est débloqué qu'une fois par joueur.

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `user_achievement_id` | SERIAL | PK | Identifiant |
| `user_id` | INTEGER | NOT NULL, FK → `users(user_id)` ON DELETE CASCADE | Joueur |
| `achievement_id` | INTEGER | NOT NULL, FK → `achievements(achievement_id)` ON DELETE CASCADE | Succès débloqué |
| `unlocked_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date de déblocage |

## Table `user_stats`

Contrainte de table : `UNIQUE (user_id, stat_key)` — un compteur par couple joueur-statistique.

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `user_stat_id` | SERIAL | PK | Identifiant |
| `user_id` | INTEGER | NOT NULL, FK → `users(user_id)` ON DELETE CASCADE | Joueur concerné |
| `stat_key` | VARCHAR(50) | NOT NULL | Nom de la statistique, ex : `ducks_found`, `games_played` (clé partagée avec les conditions des succès) |
| `stat_value` | INTEGER | NOT NULL, DEFAULT 0 | Valeur actuelle du compteur, ex : 7 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Dernière mise à jour du compteur |

## Table `notifications`

Index : `idx_notifications_user` sur `(user_id, created_at DESC)` — boîte de réception.

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `notification_id` | SERIAL | PK | Identifiant |
| `user_id` | INTEGER | NOT NULL, FK → `users(user_id)` ON DELETE CASCADE | Destinataire |
| `sender_id` | INTEGER | FK → `users(user_id)` ON DELETE SET NULL | Expéditeur (NULL = système) |
| `session_id` | INTEGER | FK → `sessions(session_id)` ON DELETE CASCADE | Salon concerné, pour rediriger après une invitation (NULL = non liée à un salon) |
| `type` | VARCHAR(50) | NOT NULL | Type : `party_invite`, `achievement_unlocked`... |
| `message` | TEXT | NOT NULL | Contenu affiché |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date d'envoi |
| `updated_at` | TIMESTAMPTZ | — | Dernière modification |