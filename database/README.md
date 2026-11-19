# Base de données — Installation et utilisation

## 1. Prérequis

- **[Python 3.10+](https://www.python.org/downloads/)**
- Accès au réseau permettant de joindre la VM2.
- **[pgAdmin](https://www.pgadmin.org/download/)** (recommandé, pour vérifier)

La base PostgreSQL est hébergée sur la VM2. Il n'est pas nécessaire d'installer PostgreSQL sur son ordinateur pour utiliser la base partagée.

## 2. Configuration de la connexion

La base de données du projet est hébergée sur la VM2.

| Paramètre | Valeur |
|---|---|
| Hôte | `10.1.136.68` |
| Port | `5432` |
| Base de données | `EvilJV_db` |
| Schéma | `public` |

Deux comptes PostgreSQL sont disponibles :

| Utilisateur | Utilisation |
|---|---|
| `sae` | Administration de la base de données (réservé à la responsable de la base) |
| `eviljv_app` | Connexion du backend et accès aux données pour les membres du groupe |

### Configuration du backend

1. Copier `database/.env.example` vers `database/.env`.
2. Renseigner la variable `DATABASE_URL` avec les identifiants du compte applicatif.

```env
DATABASE_URL=postgresql://eviljv_app:MOT_DE_PASSE@10.1.136.68:5432/EvilJV_db
```

**Important :**
- Le compte `eviljv_app` permet de consulter et modifier les données (lecture, insertion, modification et suppression).
- Il ne permet pas de créer, modifier ou supprimer les tables.
- Le mot de passe est communiqué séparément aux membres du groupe.
- Le fichier `.env` est personnel et ne doit jamais être envoyé sur Git.

## 3. Installer les dépendances

```bash
cd sae-but3/database
pip install -r requirements.txt
```
Cette commande installe notamment psycopg2-binary, qui permet à Python de communiquer avec PostgreSQL.

## 4. Déploiement et modification de la base

Les scripts SQL de création des tables se trouvent dans `database/sql/`.

Le fichier `init_db.py` permet d'exécuter ces scripts dans l'ordre prévu.

**Important : le déploiement et les modifications de structure de la base partagée sont exclusivement gérés par la responsable de la base de données.**

Les autres membres du groupe n'ont pas à exécuter `init_db.py` sur la VM2.

### Vérification des scripts

Pour vérifier la liste des scripts sans les exécuter :

```bash
python init_db.py --dry-run
```

### Déploiement de la structure

Réservé à la responsable de la base :

```bash
python init_db.py
```

### Données de démonstration

Pour un environnement local de développement uniquement :

```bash
python init_db.py --with-seed
```

Ne pas utiliser cette option sur la base partagée sans accord préalable de l'équipe.

Les modifications de structure doivent être coordonnées afin de conserver une base cohérente pour tous les membres.


## 5. Vérifier la connexion et consulter les tables

### Avec pgAdmin

Utiliser les paramètres suivants pour se connecter à la base partagée :

- Hôte : `10.1.136.68`
- Port : `5432`
- Base : `EvilJV_db`
- Utilisateur : `eviljv_app`
- Mot de passe : communiqué séparément

Les tables du projet se trouvent dans :

```mermaid
flowchart LR
    A[Servers] --> B[PostgreSQL] --> C[Databases] --> D[EvilJV_db ] --> E[Schemas] --> F[public ] --> G[Tables]
```

### Avec SQL

Requête de contrôle :

```sql
SELECT COUNT(*) FROM users;
```

Pour afficher les tables présentes :

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

## 6. Réinitialiser une base locale (développement uniquement)

Pour supprimer et recréer le schéma d'une base locale de développement :

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Puis relancer les scripts de création :

```bash
python init_db.py
```

**ATTENTION : ces commandes suppriment les tables et les données. Elles ne doivent JAMAIS être exécutées sur la base partagée de la VM2.**

## 7. Dépannage

| Symptôme | Cause possible | Solution |
|---|---|---|
| `Connection refused` | VM inaccessible, PostgreSQL arrêté ou port inaccessible | Vérifier l'accès à la VM et le port 5432 |
| `password authentication failed` | Identifiants incorrects | Vérifier le fichier `.env` |
| `DATABASE_URL non définie` | Fichier `.env` absent ou mal placé | Vérifier qu'il se trouve dans `database/` |
| `psycopg2 manquant` | Dépendance non installée | Exécuter `pip install -r requirements.txt` |
| `permission denied` | Droits insuffisants sur la base | Contacter la responsable de la base |
| `duplicate key value (23505)` | Données déjà présentes ou identifiant déjà utilisé | Vérifier les données avant toute nouvelle insertion |
| `relation does not exist (42P01)` | Table absente ou structure non déployée | Contacter la responsable de la base |

## 8. Gestion de la base de données

La base PostgreSQL est hébergée sur la VM2.

La configuration du serveur et les autorisations d'accès distant sont déjà effectuées.

- Le compte `sae` est réservé à l'administration de la base.
- Le compte `eviljv_app` est destiné aux connexions du backend.
- La création, la modification et la suppression des tables sont gérées par la responsable de la base.
- Les sauvegardes doivent être réalisées régulièrement.