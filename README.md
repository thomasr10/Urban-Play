# Urban Play

**Urban Play** est une application web et mobile conçue pour faciliter la rencontre entre sportifs amateurs. Grâce à une carte interactive alimentée par l’API officielle [equipements.sports.gouv.fr](https://equipements.sports.gouv.fr), les utilisateurs peuvent créer ou rejoindre des activités sportives locales de manière simple et sécurisée.  

---

## 🎯 Objectif et concept

Urban Play permet aux utilisateurs de :  

- Découvrir et rejoindre des activités sportives près de chez eux (rayon ajustable de 1 à 25 km).  
- Créer des événements sportifs avec des détails précis (lieu, sport, date/heure, nombre de participants).  
- Communiquer facilement grâce à des groupes de discussion créés automatiquement pour chaque activité.  

> ⚠️ Les utilisateurs doivent être âgés d’au moins 16 ans pour utiliser l’application.

---

## 🛠 Fonctionnalités clés

### Gestion des utilisateurs
- Inscription et connexion sécurisées avec vérification par e-mail.  
- Authentification via JWT pour sécuriser l’accès à l’API.  
- Profils personnalisables (photo, sports pratiqués, disponibilité…).

### Gestion des activités
- Création et publication d’événements sportifs.  
- Inscription aux activités directement via la carte interactive.  
- Affichage des infrastructures sportives disponibles autour de l’utilisateur.  

### Communication
- Création automatique d’un **groupe de discussion** via WebSocket pour chaque activité.  
- Notifications et messages en temps réel entre participants.  

---

## 💻 Technologies utilisées

- **Front-end** : React avec SCSS pour une interface réactive et mobile-first.  
- **Back-end** : Symfony (PHP) avec Doctrine ORM et LexikJWTAuthenticationBundle pour l’API et l’authentification.  
- **Base de données** : MySQL, modélisation Merise.  
- **Cartographie** : Leaflet (JavaScript) et données OpenStreetMap.  

---

## 🏗 Architecture et développement

- Projet structuré en deux dossiers : `front` (React) et `back` (Symfony).  
- Entités principales :  
  - `User`  
  - `Activity`  
  - `Sport`  
  - `GroupChat`  
- Processus de création d’activité :  
  1. Sélection du créneau et du lieu.  
  2. Enregistrement des données en base.  
  3. Génération automatique du groupe de discussion associé.  

---

## 🚀 Installation

### 1. Back-end (Symfony)
```bash
composer install
cp .env.example .env
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
symfony server:start
```

### 2. Back-end WebSocket (Node.JS)
```bash
cd back
cd websocket-server
npm install
node server
```

### 2. Front-end (React)
```bash
cd front
npm install
npm run dev
```