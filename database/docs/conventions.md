# Conventions de données EvilJV

> Ce document définit les conventions de nommage, les structures de données et les règles à respecter lors de l'ajout ou de la modification de statistiques, mini-jeux et achievements dans EvilJV.
>  À destination des développeurs back (SQLAlchemy) et front.
> Chaque règle ici est appliquée dans la base : si vous la violez, PostgreSQL vous le dira.


## 1. Règles de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Tables | minuscules, pluriel, `snake_case` | `users`, `user_profiles`, `users_modules` |
| Colonnes | minuscules, `snake_case` | `module_id`, `best_score` |
| Booléens | suffixe `_flag` | `banned_flag`, `multiplayer_flag`, `connected_flag` |
| Clés primaires | `<table_au_singulier>_id` | `user_id`, `game_id`, `session_id` |
| Clés étrangères | même nom que la PK référencée | `users.user_id` → référencé partout sous `user_id` |
| Date de création | `created_at` (TIMESTAMPTZ) | présent sur toutes les tables |
| Dernière modification | `updated_at` (TIMESTAMPTZ), `NULL` si jamais modifié | present sur les tables modifiables |
| Tables de liaison | noms des deux entités, ordre alphabétique | `users_modules`, `sessions_users` |

### Colonnes techniques à connaître

- `created_by` / `last_modified_by` : FK vers `users` (qui a créé/modifié la ressource)
- `*_flag` : `BOOLEAN NOT NULL` avec défaut explicite — jamais NULL
- **Toutes les dates sont en `TIMESTAMPTZ`** : ne jamais écrire `TIMESTAMP` seul

---

## 2. Statistiques (`user_stats`)

La table `user_stats` stocke les compteurs associés à chaque joueur.

| Colonne | Rôle |
|---|---|
| `user_id` | Joueur concerné |
| `stat_key` | Identifiant de la statistique |
| `stat_value` | Valeur du compteur |
| `updated_at` | Date de dernière modification |

Chaque statistique est identifiée par une `stat_key` unique pour un joueur.

### 2.1. Statistiques référencées dans les scripts

Les statistiques des joueurs sont stockées en **clé-valeur** :
`(user_id, stat_key, stat_value)`.

### Liste des `stat_key` existants

| stat_key | Type | Description | Utilisé par |
|---|---|---|---|
| `games_played` | int | nombre total de parties jouées | stats joueur |
| `victories` | int | nombre de parties gagnées | stats joueur, succès "Première victoire" |
| `ducks_found` | int | canards attrapés (jeu Duck Hunt) | succès "Chasseur de canards" |
| `quizzes_perfect` | int | quiz réussis sans faute | succès "Maître du Quiz" |
| `multi_games` | int | parties jouées en salon multi | succès "Sociable" |

Ces clés sont présentes dans les données de démonstration et/ou les conditions des achievements. Leur mise à jour effective doit être vérifiée dans le backend.

### 2.2. Ajouter une statistique

1. Vérifier que la `stat_key` n'existe pas déjà.
2. Choisir un nom explicite en `snake_case`.
3. Définir précisément ce que la statistique mesure.
4. Définir l'événement backend qui provoque son incrémentation ou sa mise à jour.
5. Vérifier sa compatibilité avec les conditions des achievements.
6. Ajouter ou adapter le traitement backend.
7. Documenter la clé dans ce fichier.

Une statistique ne doit pas être créée uniquement pour un achievement sans vérifier si une statistique existante peut déjà être utilisée.

## 3. Conditions des achievements (`unlock_condition`)

La colonne `achievements.unlock_condition` est de type JSONB.

Les conditions sont structurées selon un type de condition identifié par la clé `type`.

### 3.1. Condition basée sur une statistique

Structure :

```json
{
  "type": "stat",
  "stat_key": "victories",
  "value": 1
}
```

- `type` : identifie une condition basée sur une statistique.
- `stat_key` : désigne la statistique à vérifier.
- `value` : seuil à atteindre.

La `stat_key` doit correspondre exactement à une statistique reconnue par le backend.

Exemples présents dans les scripts :

```json
{"type": "stat", "stat_key": "victories", "value": 1}
```

```json
{"type": "stat", "stat_key": "quizzes_perfect", "value": 10}
```

```json
{"type": "stat", "stat_key": "multi_games", "value": 5}
```

```json
{"type": "stat", "stat_key": "ducks_found", "value": 12}
```

### 3.2. Condition basée sur un score

Structure :

```json
{
  "type": "score",
  "min_score": 300
}
```

- `type` : identifie une condition basée sur le score.
- `min_score` : score minimum à atteindre.

Exemples présents dans les scripts :

```json
{"type": "score", "min_score": 300}
```

```json
{"type": "score", "min_score": 1000}
```

### 3.3. Condition spécifique au tutoriel

Structure :

```json
{
  "type": "tutorial_completed",
  "value": true
}
```

Cette condition permet de vérifier la validation du tutoriel.

### 3.4. Ajouter une condition

- Utiliser un type de condition déjà pris en charge lorsque cela est possible.
- Ne pas inventer de nouveaux types sans implémentation backend.
- Pour une condition de type `stat`, réutiliser une `stat_key` existante ou ajouter une nouvelle statistique selon la procédure définie.
- Toute nouvelle condition doit être prise en charge par le backend avant d'être utilisée dans la BDD.

## 4. Structures JSONB des mini-jeux (`games`)

La table `games` comporte deux colonnes JSONB :

- `data` : contenu et éléments propres au mini-jeu.
- `config` : paramètres et règles de fonctionnement du mini-jeu.

Ces deux champs ne doivent pas être confondus. Leur structure dépend du mini-jeu concerné.

### 4.1. `games.data`

Le champ `data` contient les éléments nécessaires au contenu du mini-jeu.

Exemple de quiz :

```json
{
  "questions": [
    {
      "id": 1,
      "question": "Que vaut x après x = 5 ; x += 3 ?",
      "choices": ["3", "8", "5"],
      "correct_choice": 1
    }
  ]
}
```

Exemple de tutoriel :

```json
{
  "steps": [
    {"id": 1, "title": "Bienvenue"},
    {"id": 2, "title": "Bouton secret"},
    {"id": 3, "title": "Contrôles"}
  ]
}
```

Exemple de casino :

```json
{
  "reels": 3,
  "symbols": ["7", "BAR", "CHERRY", "COIN", "SKULL"]
}
```

Exemple de jeu d'exploration :

```json
{
  "zones": ["surface", "ocean_jour", "abysses"],
  "oxygen_max": 100
}
```

Exemple de jeu d'audit UI/UX :

```json
{
  "topics": ["responsive", "wcag", "forms", "ergonomics"],
  "rounds": 20
}
```

Ces exemples illustrent les structures présentes dans les données de démonstration. Ils ne constituent pas un schéma universel applicable à tous les mini-jeux.

### 4.2. `games.config`

Le champ `config` contient les paramètres de fonctionnement du mini-jeu.

Exemple de configuration de quiz :

```json
{
  "time_per_question": 25,
  "points_per_correct": 50,
  "max_possible": 50
}
```

Exemple de configuration du tutoriel :

```json
{
  "time_limit": 120,
  "points_per_step": 25,
  "max_possible": 100
}
```

Exemple de configuration du casino :

```json
{
  "initial_coins": 100,
  "cost_per_spin": 10,
  "max_possible": 2000
}
```

Exemple de configuration du jeu d'audit UI/UX :

```json
{
  "time_limit_sec": 15,
  "points_per_correct": 100,
  "streak_bonus": 25,
  "max_players": 4
}
```

Les champs de configuration doivent être cohérents avec le code du mini-jeu. L'ajout d'un paramètre nécessite sa prise en charge par le backend ou le moteur de jeu concerné.

## 5. Calcul et enregistrement des scores

> Le score est calculé par le serveur, jamais fourni comme valeur fiable par le client.

- Le frontend transmet les actions ou les éléments nécessaires à la validation de la partie.
- Le serveur vérifie les données reçues.
- Le serveur détermine le score final.
- Le serveur enregistre le score dans la table `scores`.
- Les classements utilisent les scores enregistrés côté serveur.

Le client ne doit jamais pouvoir imposer librement son score final, ses récompenses ou ses résultats.

## 6. Règles lors de l'ajout d'un mini-jeu

- Respecter les conventions de nommage.
- Définir clairement le contenu dans `data`.
- Définir les paramètres de fonctionnement dans `config`.
- Vérifier la cohérence entre les données JSONB et le code du mini-jeu.
- Définir les règles de calcul du score côté serveur.
- Vérifier la compatibilité avec les sessions, les scores et les statistiques.
- Vérifier si le mini-jeu nécessite de nouveaux achievements ou de nouvelles statistiques.

## 7. Règles lors de l'ajout d'un achievement

- Utiliser une condition prise en charge par le backend.
- Réutiliser les `stat_key` existantes lorsque cela est possible.
- Vérifier que la condition est effectivement évaluée.
- Vérifier que le déblocage ne peut pas être déclenché artificiellement par le client.
- Respecter l'unicité du déblocage pour un joueur.

## 8. Évolution des données

Toute modification des conventions, statistiques, conditions ou structures JSONB doit être :

- cohérente avec la BDD ;
- prise en charge par le backend ;
- communiquée aux développeurs concernés ;
- documentée dans ce fichier lorsqu'elle modifie les conventions existantes.




