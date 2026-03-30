# 🎓 Novy — Le réseau social de Paris Ynov Campus

> **Challenge 48H — Paris Ynov Campus | Équipe 6**

Novy est une plateforme sociale full-stack exclusive aux étudiants de Paris Ynov Campus. Elle centralise le fil d'actualité, les événements du campus, la messagerie, les offres de stages/alternances et un chatbot IA — le tout dans une interface moderne et immersive.

---

## 🚀 Installation & Lancement

### Prérequis
- [Node.js](https://nodejs.org/) v18+
- [XAMPP](https://www.apachefriends.org/) (pour MySQL/MariaDB)
- Git

### 1. Cloner le projet
```bash
git clone https://github.com/VOTRE_REPO/novy.git
cd novy
```

### 2. Installer les dépendances
```bash
npm install --legacy-peer-deps
```

### 3. Configurer les variables d'environnement
Ouvrir `.env` à la racine et renseigner :
```env
GROQ_API_KEY=votre_cle_groq       # https://console.groq.com/keys
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=                       # vide par défaut sur XAMPP
DB_NAME=novy
JWT_SECRET=novy_super_secret_jwt
```

### 4. Démarrer MySQL (XAMPP)
Ouvrir **XAMPP Control Panel** → cliquer **Start** sur **MySQL**.

### 5. Importer la base de données
```bash
# Option 1 — Script automatique Windows
scripts\import-db.bat

# Option 2 — phpMyAdmin
# http://localhost/phpmyadmin → Importer → db/schema.sql
```

### 6. Lancer le projet
```bash
# Terminal 1 — Backend API (port 3001)
npm run backend

# Terminal 2 — Frontend Vite (port 5174)
npm run dev
```

Ou lancer en un clic avec :
```bash
scripts\start-dev.bat
```

➡️ **Frontend :** http://localhost:5174  
➡️ **Backend :** http://localhost:3001  
➡️ **Health check :** http://localhost:3001/health

### Comptes de démonstration
| Email | Mot de passe |
|-------|-------------|
| alex.dupont@ynov.com | password123 |
| emma.bernard@ynov.com | password123 |
| karim.ndiaye@ynov.com | password123 |
| sophie.martin@ynov.com | password123 |

---

## 🏗️ Architecture technique

### Stack

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Frontend | React 18 + Vite | SPA rapide, composants réutilisables |
| Routing | React Router v6 | Navigation côté client |
| Backend | Express.js (Node.js) | API REST légère et rapide |
| Base de données | MySQL / MariaDB | Données relationnelles, requis par le cahier des charges |
| Auth | JWT + bcrypt | Authentification stateless sécurisée |
| IA | Groq API (Llama 3.3 70B) | Ultra-rapide, gratuit, excellent en français |
| Avatars | DiceBear API | Avatars uniques par utilisateur |

### Structure du projet
```
novy/
├── backend/
│   ├── config/db.js          # Pool MySQL (mysql2/promise)
│   ├── models/
│   │   ├── User.js           # Classe User (OOP)
│   │   ├── Post.js           # Classe Post (OOP)
│   │   └── Message.js        # Classe Message (OOP)
│   ├── routes/
│   │   ├── auth.js           # POST /login, POST /register, GET /me
│   │   ├── posts.js          # CRUD posts + toggle like
│   │   ├── messages.js       # Conversations & envoi
│   │   ├── news.js           # Actualités campus
│   │   └── ai.js             # Chatbot + modération + résumé profil
│   ├── services/
│   │   └── aiService.js      # Singleton Groq (Llama 3.3)
│   └── server.js             # Express app
├── db/
│   └── schema.sql            # 9 tables + seed data
├── src/
│   ├── pages/
│   │   ├── Feed.jsx          # Fil d'actualité + News Ynov sidebar
│   │   ├── Profile.jsx       # Profil éditable + compétences + XP
│   │   ├── Messaging.jsx     # Messagerie privée
│   │   ├── JobBoard.jsx      # Offres Ymatch
│   │   ├── Chatbot.jsx       # NovyBot (Groq IA)
│   │   ├── News.jsx          # Toutes les actualités
│   │   └── Login.jsx         # Authentification
│   ├── components/
│   │   ├── Header.jsx        # Navigation sticky
│   │   └── PostModal.jsx     # Modal création de post
│   ├── api.js                # Client API centralisé (JWT)
│   └── index.css             # Design system premium
└── scripts/
    ├── start-dev.bat         # Lancement tout-en-un
    └── import-db.bat         # Import BDD automatique
```

---

## 🎨 Charte Graphique

| Élément | Valeur |
|---------|--------|
| Couleur de fond | `#0d0e12` (charcoal profond) |
| Accent principal | `#7c3aed` → `#d946ef` (violet → pink) |
| Accent secondaire | `#06b6d4` (cyan) |
| Or / Achievements | `#f59e0b` (gold) |
| Typographie | **Plus Jakarta Sans** (Google Fonts) |
| Style | Glassmorphism + Neon dark-mode |

---

## 🧠 Fonctionnalités principales

### ✅ Requises par le cahier des charges
1. **Inscription / Connexion sécurisée** — bcrypt + JWT
2. **Fil d'actualité** — Posts, likes animés, tags, stories
3. **News Ynov** — Sidebar sur la même page que le feed (Événements, BDS, BDE, Pédagogie)
4. **Profil personnalisable** — Bio, compétences, XP gamifié, badges
5. **Messagerie** — Conversations privées avec online status
6. **Job Board Ymatch** — Offres stages/alternances avec lien vers ymatch.fr
7. **Base de données MySQL** — 9 tables relationnelles avec clés étrangères
8. **Intelligence Artificielle** — NovyBot (Groq × Llama 3.3 70B), modération des posts, génération de résumé de profil

### 🌟 Fonctionnalités supplémentaires
- **Design system** premium avec glassmorphism et animations CSS
- **Thème dark-mode** immersif avec blobs lumineux
- **Stories animées** avec ring conic gradient
- **Avatars DiceBear** uniques par utilisateur
- **Système XP gamifié** : gagner des points en publiant/recevant des likes
- **Modération IA** automatique des posts avant publication

---

## 🔒 Sécurité

- Mots de passe **hashés** avec bcrypt (salt rounds: 10)
- **JWT** expirant en 7 jours
- **CORS** configuré pour n'autoriser que le frontend
- **Helmet.js** pour les headers HTTP de sécurité
- Clé API Groq **uniquement côté backend** (jamais exposée au navigateur)

---

## 💡 Programmation Orientée Objet (POO)

Le backend est structuré en **classes OOP** :

```javascript
// Exemple — Classe User (backend/models/User.js)
class User {
  constructor(row) { /* encapsulation */ }
  static async findById(id) { /* méthode statique */ }
  static async create({ email, password, name }) { /* factory */ }
  static async verifyPassword(plain, hash) { /* bcrypt */ }
  async getSkills() { /* méthode d'instance */ }
  toJSON() { /* sérialisation sécurisée */ }
}
```

**Principes appliqués :**
- **Encapsulation** : chaque modèle gère ses propres requêtes SQL
- **Abstraction** : les routes n'accèdent jamais directement à la DB
- **Responsabilité unique** : une classe = un modèle métier

---

## 👥 Équipe

| Nom | Rôle | Niveau |
|-----|------|--------|
| [Étudiant 1] | Lead Dev Backend | B2 |
| [Étudiant 2] | Lead Dev Frontend | B2 |
| [Étudiant 3] | Dev Frontend | B1 |
| [Étudiant 4] | Dev Backend / BDD | B1 |

---

## 📄 Licence
Projet réalisé dans le cadre du **Challenge 48H — Paris Ynov Campus 2026**.
