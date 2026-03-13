# 🚀 Guide de mise à jour — Version 2 avec Notion automatique

## Ce qui a changé dans cette version

| Fonctionnalité | V1 | V2 |
|---|---|---|
| Formulaire client | ✅ | ✅ |
| Page admin visible par le client | ❌ | Supprimée |
| Espace admin avec PIN | ❌ | ✅ |
| Envoi Notion automatique | Manuel | **Automatique** |
| Liste des fiches reçues | ❌ | ✅ |
| Export PDF depuis l'admin | ❌ | ✅ |
| Envoi Gmail depuis l'admin | ❌ | ✅ |
| Création base Notion auto | ❌ | ✅ |

---

## ÉTAPE 1 — Créer une intégration Notion

1. Allez sur → **https://www.notion.so/my-integrations**
2. Cliquez **"+ New integration"**
3. Remplissez :
   - **Name** : `Sextant Fiche Découverte`
   - **Logo** : optionnel
   - **Associated workspace** : votre workspace
4. Cliquez **"Submit"**
5. Copiez le **"Internal Integration Secret"** (commence par `secret_...`)
   → C'est votre **NOTION_TOKEN**

---

## ÉTAPE 2 — Préparer une page Notion parent

1. Dans Notion, créez une **nouvelle page vide** (ex: "Sextant CRM")
2. Cliquez les **"..."** en haut à droite de la page → **"Connections"**
3. Cherchez **"Sextant Fiche Découverte"** et cliquez dessus pour l'autoriser
4. Récupérez l'**ID de cette page** depuis l'URL :
   `notion.so/votre-workspace/`**`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`**`?v=...`
5. Notez cet ID → il vous servira dans l'admin pour créer la base

---

## ÉTAPE 3 — Mettre à jour le dépôt GitHub

Depuis le Terminal (sur votre ordinateur) dans le dossier `fiche-decouverte` :

**Option A — Remplacer les fichiers existants :**
1. Copiez tous les fichiers du nouveau ZIP dans votre dossier existant
2. Dans le Terminal :
```bash
git add .
git commit -m "Version 2 - Admin panel + Notion automatique"
git push
```

**Option B — Nouveau dépôt :**
```bash
cd fiche-decouverte-v2
git init
git add .
git commit -m "Version 2 - Admin panel + Notion automatique"
git branch -M main
git remote add origin https://github.com/senegal972/fiche-decouverte.git
git push -u origin main --force
```

---

## ÉTAPE 4 — Configurer les variables Vercel

1. Allez sur → **https://vercel.com/dashboard**
2. Cliquez sur votre projet **fiche-decouverte**
3. Onglet **"Settings"** → **"Environment Variables"**
4. Ajoutez ces 3 variables :

| Variable | Valeur | Obligatoire |
|---|---|---|
| `NOTION_TOKEN` | secret_xxxxxx... (votre token Notion) | ✅ |
| `NOTION_DB_ID` | ID de la base (créé à l'étape suivante) | ✅ |
| `ADMIN_PIN` | Un code à 4-6 chiffres de votre choix | Optionnel (défaut: 1234) |

5. Cliquez **"Save"** après chaque variable
6. Allez dans **"Deployments"** → cliquez les **"..."** → **"Redeploy"**

---

## ÉTAPE 5 — Créer la base Notion automatiquement

1. Ouvrez votre application → **https://votre-url.vercel.app**
2. Cliquez **"espace agent"** (en bas à droite)
3. Entrez votre code PIN
4. Dans le menu → **"⚙️ Configuration Notion"**
5. Collez l'ID de votre page parent (étape 2)
6. Cliquez **"🚀 Créer la base Notion"**
7. Une fois créée, **copiez l'ID retourné**
8. Retournez dans Vercel → Settings → Environment Variables
9. Mettez à jour **NOTION_DB_ID** avec cet ID
10. Redéployez (Deployments → Redeploy)

---

## ÉTAPE 6 — Tester

1. Ouvrez votre URL en navigation privée (pour simuler un client)
2. Remplissez la fiche et cliquez **"Valider et envoyer ma fiche"**
3. Vérifiez dans votre **Notion** → la fiche doit apparaître automatiquement
4. Connectez-vous à l'**espace agent** → vérifiez que la fiche est visible

---

## Utilisation quotidienne

### Pour vos clients :
Envoyez simplement l'URL :
```
https://votre-url.vercel.app
```

### Pour vous (admin) :
1. Allez sur la même URL
2. Cliquez **"espace agent"** (en bas à droite, discret)
3. Entrez votre PIN
4. Accédez au tableau de bord

---

## En cas de problème

**"Erreur de connexion Notion"** → Vérifiez que NOTION_TOKEN est bien configuré dans Vercel

**"NOTION_DB_ID non configuré"** → Créez d'abord la base via l'admin, puis ajoutez l'ID dans Vercel

**La page admin ne s'affiche pas** → Vérifiez que vous avez bien redéployé après avoir ajouté les variables

**Code PIN incorrect** → Le PIN par défaut est `1234` si vous n'avez pas configuré ADMIN_PIN
