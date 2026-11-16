\# Base de données — Installation et utilisation



\## 1. Prérequis

\- \*\*\[PostgreSQL 15+](https://www.postgresql.org/download/)\*\* installé (cocher : "se souvenir du mot de passe du compte postgres")

\- \*\*\[Python 3.10+](https://www.python.org/downloads/)\*\*

\- \*\*\[pgAdmin](https://www.pgadmin.org/download/)\*\* (recommandé, pour vérifier)



\## 2. Créer la base

\-- dans pgAdmin ou psql :



```psql

CREATE USER sae\_user WITH PASSWORD '...';   -- ou utiliser le compte postgres en local

CREATE DATABASE EvilJV\_db;

```



\## 3. Configurer la connexion

1\. Copier database/.env.example → database/.env

2\. Renseigner ```DATABASE\_URL=postgresql://user:motdepasse@localhost:5432/EvilJV\_db```

(le .env est ignoré par Git — jamais de mot de passe dans le repo)



\## 4. Installer les dépendances



```bash

cd sae-but3/database

pip install -r requirements.txt

```



\## 5. Déployer la base



Vous n'avez à en choisir qu'un en fonction de ce que vous souhaitez faire.



```bash

python init\_db.py --dry-run    # vérifier la liste (14 scripts, ordre 01→14)

python init\_db.py              # déploiement (structure seule = mode prod)

python init\_db.py --with-seed  # + données de démo — DÉVELOPPEMENT UNIQUEMENT

```



\## 6. Vérifier

Dans pgAdmin : 

```mermaid

flowchart LR

&#x20;   A\[Schemas] --> B\[public] --> C\[Tables] --> D\[14 tables présentes]

```



Requête de contrôle : ```SELECT COUNT(\*) FROM users;```





\## 7. Réinitialiser la base (développement)



```psql

DROP SCHEMA public CASCADE; CREATE SCHEMA public;

```

\-- puis relancer init\_db.py



\## 8. Dépannage

| Symptôme | Cause | Solution |

|---|---|---|

| "Connection refused" / OperationalError | PostgreSQL pas lancé, mauvais port, pare-feu | vérifier le service, le port 5432, pg\_hba.conf |

| "password authentication failed" | mauvais mot de passe/utilisateur dans .env | corriger le .env |

| duplicate key value (23505) | script rejoué sur base non vidée | reset (§7) puis relancer |

| relation does not exist (42P01) | scripts exécutés hors d'ordre | reset puis init\_db.py (il trie) |

| \\dt ne marche pas dans pgAdmin | commande psql, pas SQL | utiliser information\_schema.tables |



\## 9. Déploiement sur la VM (production)

\- Mêmes étapes, DATABASE\_URL pointe vers l'IP de la VM

\- Accès réseau : listen\_addresses, pg\_hba.conf, port 5432 au pare-feu

\- pg\_dump hebdomadaire pour la sauvegarde

