# 🚀 Novy — Guide de Démarrage Rapide (Spécial Collègues)

Si vous avez des erreurs "Failed" ou "Server Error" après avoir fait un `git pull`, suivez ces étapes précisément.

---

## 1. Mettre à jour les dépendances
Après chaque `git pull`, il peut y avoir de nouvelles bibliothèques. Tapez ceci dans un terminal à la racine du projet :
```powershell
npm install
```

## 2. Configurer le fichier d'environnement (`.env`)
Le fichier `.env` n'est **jamais** envoyé sur Git pour des raisons de sécurité. Sans lui, le backend ne sait pas comment se connecter à la base de données.

1. Créez un fichier nommé `.env` à la racine du projet (au même niveau que `package.json`).
2. Copiez-collez le contenu suivant dedans :
```env
# Database (XAMPP par défaut)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=novy

# Sécurité
JWT_SECRET=novy_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d

# Configuration Serveur
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Clés API (Optionnel pour le chat AI)
GROQ_API_KEY=votre_cle_ici
GEMINI_API_KEY=votre_cle_ici
```

## 3. Lancer XAMPP
Le site a besoin d'une base de données MySQL pour fonctionner.
1. Ouvrez le **XAMPP Control Panel**.
2. Cliquez sur **Start** pour **Apache** et **MySQL**.
3. Assurez-vous que les lignes deviennent vertes.

## 4. Importer la Base de Données
Si c'est votre première fois ou si la structure a changé :
1. Allez dans le dossier `scripts/`.
2. Lancez le fichier `import-db.bat` (double-clic).
   - *Note : Si cela échoue, vérifiez que XAMPP est installé dans `C:\xampp`. Si il est ailleurs, vous devrez créer la base manuellement via phpMyAdmin.*

**Option manuelle (phpMyAdmin) :**
1. Allez sur http://localhost/phpmyadmin/
2. Créez une nouvelle base de données nommée `novy`.
3. Cliquez sur l'onglet **Importer** et choisissez le fichier `db/schema.sql` du projet.

## 5. Lancer le projet (2 terminaux requis)

### Terminal 1 : Le Frontend (Site)
```powershell
npm run dev
```
*Le site sera accessible sur http://localhost:5173*

### Terminal 2 : Le Backend (Serveur API)
```powershell
npm run backend
```
*Le serveur sera sur http://localhost:3001*

---

## 🔍 Comment savoir si ça marche ?
- **Vérifier le Backend :** Allez sur http://localhost:3001/health. Si vous voyez `{"status": "ok", "db": "connected"}`, tout est parfait !
- **Erreurs de Ports :** Si le port 3001 est déjà pris, changez `PORT=3001` dans votre `.env` et mettez à jour le lien dans `src/api.js`.

---

## 💡 Astuces
- Si vous avez une erreur `module not found`, refaites un `npm install`.
- Si MySQL ne veut pas démarrer dans XAMPP, vérifiez qu'aucune autre instance de MySQL (ou Skype/Wamp) n'utilise le port 3306.
