# 🚀 Guide de déploiement — Fiche Découverte Sextant

## Ce que vous obtenez
Une application web accessible via un lien URL que vous envoyez à vos clients.
Ils remplissent la fiche → vous recevez les données dans Notion + PDF + Gmail.

---

## ÉTAPE 1 — Créer votre compte GitHub (2 minutes)

1. Allez sur **https://github.com/signup**
2. Entrez :
   - Votre email (ex : franck.fidi@sextantfrance.fr)
   - Un mot de passe
   - Un nom d'utilisateur (ex : **franckfidi-sextant**)
3. Vérifiez votre email → cliquez le lien de confirmation
4. Choisissez le plan **Free** (gratuit, suffisant)

---

## ÉTAPE 2 — Installer Git sur votre ordinateur (si pas déjà fait)

### Sur Mac :
Ouvrez le Terminal et tapez :
```
git --version
```
Si Git n'est pas installé, il vous proposera de l'installer automatiquement.

### Sur Windows :
Téléchargez Git depuis **https://git-scm.com/download/win** et installez-le.

---

## ÉTAPE 3 — Créer le dépôt GitHub

1. Connectez-vous sur **https://github.com**
2. Cliquez le bouton vert **"New"** (ou **"+"** en haut à droite → "New repository")
3. Remplissez :
   - **Repository name** : `fiche-decouverte`
   - **Description** : `Fiche Découverte Immobilière — Sextant France Martinique`
   - Sélectionnez **Public** (nécessaire pour GitHub Pages gratuit)
   - **NE PAS** cocher "Add a README file"
4. Cliquez **"Create repository"**

---

## ÉTAPE 4 — Envoyer les fichiers sur GitHub

Ouvrez le Terminal (Mac) ou Git Bash (Windows) et exécutez ces commandes **une par une** :

```bash
# 1. Allez dans le dossier du projet (adaptez le chemin)
cd /chemin/vers/fiche-decouverte

# 2. Initialisez Git
git init

# 3. Ajoutez tous les fichiers
git add .

# 4. Premier commit
git commit -m "Déploiement initial — Fiche Découverte Sextant"

# 5. Définissez la branche principale
git branch -M main

# 6. Liez au dépôt GitHub (remplacez VOTRE-USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/VOTRE-USERNAME/fiche-decouverte.git

# 7. Envoyez les fichiers
git push -u origin main
```

Lors de la première connexion, GitHub vous demandera vos identifiants.

---

## ÉTAPE 5 — Activer GitHub Pages

1. Sur GitHub, allez dans votre dépôt `fiche-decouverte`
2. Cliquez **"Settings"** (onglet en haut)
3. Dans le menu gauche, cliquez **"Pages"**
4. Sous **"Source"**, sélectionnez **"GitHub Actions"**
5. Cliquez **"Save"**

Le déploiement se lance automatiquement (attendez 2-3 minutes).

---

## ÉTAPE 6 — Récupérer votre URL

Après 2-3 minutes, retournez dans **Settings → Pages**.
Votre URL apparaît en haut :

```
https://VOTRE-USERNAME.github.io/fiche-decouverte/
```

**C'est cette URL que vous envoyez à vos clients !**

---

## ÉTAPE 7 — Configuration Notion (pour recevoir les fiches)

### Créer la base Notion :
1. Ouvrez Notion → Créez une nouvelle page
2. Tapez `/database` → choisissez **"Table - Full page"**
3. Nommez-la **"Fiches Découverte"**
4. Ajoutez ces colonnes :
   - Nom (texte — déjà présent)
   - Type (sélection)
   - Lieu (texte)
   - Budget (nombre)
   - Téléphone (téléphone)
   - Email (email)
   - Statut (statut)

### Récupérer l'ID de votre base :
1. Ouvrez votre base Notion
2. Regardez l'URL dans votre navigateur :
   `https://notion.so/votre-workspace/`**`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`**`?v=...`
3. Copiez les 32 caractères en gras
4. Collez-les dans le champ "ID de la base Notion" de l'application

### Connecter Notion à Claude.ai :
1. Allez sur **https://claude.ai**
2. Paramètres → Connexions → Activez **Notion**
3. Autorisez l'accès à votre workspace

---

## Mises à jour futures

Si vous souhaitez modifier l'application, rééditez les fichiers puis :

```bash
git add .
git commit -m "Mise à jour de l'application"
git push
```

Le site se met à jour automatiquement en 2-3 minutes.

---

## Support

Pour toute question technique, contactez votre prestataire ou consultez :
- Documentation GitHub Pages : https://docs.github.com/fr/pages
- Documentation Notion API : https://developers.notion.com
