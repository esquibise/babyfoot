# Gestionnaire de Tournois de Baby-Foot

##  Objectif

Bienvenue sur votre application web de gestion de tournois de baby-foot ! Cette plateforme permet de :

Créer des tournois (nom, date, description),

Ajouter des équipes,

Générer les matchs automatiquement,

Enregistrer les scores,

Et consulter un classement mis à jour en temps réel.

Le tout dans une interface simple et efficace.

##  Prérequis

*   Node.js (version 18 LTS recommandée)
*   npm (généralement inclus avec Node.js)
*   Docker et Docker Compose (pour l'exécution conteneurisée)

##  Installation et Lancement

Vous pouvez lancer l'application de deux manières :


### 1. Lancement avec Docker

1.  Assurez-vous que Docker et Docker Compose sont installés et en cours d'exécution.
2.  Ouvrez un terminal à la **racine du projet** (le dossier `babyfoot`).
3.  Construisez et lancez les conteneurs : `docker-compose up --build`
4.  Attendez que les builds soient terminés et que les logs indiquent que les services sont prêts.
5.  Ouvrez votre navigateur et allez à l'adresse : `http://localhost:8080`.

Pour arrêter les conteneurs Docker, retournez dans le terminal où `docker-compose up` est lancé et faites `Ctrl+C`.

### 2. Lancement Local

*   **Backend :**
    1.  Naviguez dans le dossier `backend` : `cd backend`
    2.  Installez les dépendances : `npm install`
    3.  Lancez le serveur backend : `node src/index.js` 

*   **Frontend :**
    1.  Ouvrez un autre terminal et naviguez dans le dossier `frontend` : `cd frontend`
    2.  Installez les dépendances : `npm install`
    3.  Lancez le serveur de développement frontend : `npm run dev`
    4.  Ouvrez votre navigateur et allez à l'URL indiquée par Vite .


## Structure du Projet

```
/babyfoot
├── backend/         # API Node.js (Express, Sequelize)
│   ├── src/
│   ├── config/
│   ├── Dockerfile
│   └── package.json
├── frontend/        # Application Vue 3 (Vite)
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml # Orchestration des conteneurs
└── README.md        # Ce fichier
```

## fOnctionnalités Implémentées

*   Création de nouveaux tournois (nom, date, description).
*   Liste des tournois existants.
*   Affichage des détails d'un tournoi.
*   Ajout d'équipes à un tournoi spécifique.
*   Génération automatique des matchs (round-robin simple) pour un tournoi.
*   Saisie et mise à jour des scores pour chaque match.
*   Calcul et affichage du classement des équipes basé sur les points (Victoire=3, Nul=1, Défaite=0) et critères de départage (Différence de buts, Buts marqués, Nom).
*   Interface utilisateur basique mais fonctionnelle avec Vue 3.
*   API backend simple avec Node.js, Express, Sequelize et SQLite.
*   Configuration Docker pour un déploiement/lancement simplifié.
*   Tests unitaires
