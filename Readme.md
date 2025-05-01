# 🤖 Discord–YouTube–Twitch Notification Bot

## 🇫🇷 Français / 🇬🇧 English

---

## 1. Cloner le projet / Clone the repository

```bash
# 🇫🇷
git clone git@github.com:Slingod/InfluenBOT.git
cd votre-repo-discord-bot

# 🇬🇧
git clone git@github.com:Slingod/InfluenBOT.git
cd your-discord-bot-repo
```

### 2. Installer les dépendances / Install dependencies

# 🇫🇷

npm install discord.js googleapis node-fetch dotenv

# 🇬🇧

npm install discord.js googleapis node-fetch dotenv

### 3. Préparer le fichier d’environnement / Prepare the environment file

- Dupliquer le template et le renommer en .env

- Remplir chaque variable ci-dessous avec VOS propres valeurs.

# 🇫🇷 Copiez ce contenu dans votre fichier .env

# 🇬🇧 Copy this content into your .env file

```bash
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN # FR : Token du bot (Discord Dev Portal → Bot → Copy Token) # EN : Bot token (Discord Dev Portal → Bot → Copy Token)
DISCORD_GUILD_ID=YOUR_DISCORD_SERVER_ID # FR : ID du serveur (clic droit → Copier l’ID) # EN : Server ID (right-click server → Copy ID)
DISCORD_CHANNEL_ID=YOUR_DISCORD_CHANNEL_ID # FR : ID du salon notifications (clic droit → Copier l’ID) # EN : Channel ID for notifications (right-click channel → Copy ID)
DISCORD_ROLE_ID=YOUR_DISCORD_ROLE_ID # FR : ID du rôle à mentionner (clic droit rôle → Copier l’ID) # EN : Role ID to mention (right-click role → Copy ID)

YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY # FR : Clé YouTube Data API v3 (Google Cloud Console → API & Services → Credentials) # EN : YouTube Data API v3 key (Google Cloud Console → API & Services → Credentials)
YOUTUBE_CHANNEL_ID=YOUR_YOUTUBE_CHANNEL_ID # FR : ID de la chaîne YouTube (UC…) # EN : YouTube Channel ID (UC…)

TWITCH_CLIENT_ID=YOUR_TWITCH_CLIENT_ID # FR : Client ID Twitch (dev.twitch.tv → Console → Apps) # EN : Twitch Client ID (dev.twitch.tv → Console → Apps)
TWITCH_CLIENT_SECRET=YOUR_TWITCH_CLIENT_SECRET # FR : Client Secret Twitch (généré sur la même page) # EN : Twitch Client Secret (generated on same page)
TWITCH_CHANNEL_NAME=YOUR_TWITCH_CHANNEL_NAME # FR : Nom de votre chaîne Twitch (ex : “monpseudo”) # EN : Your Twitch channel login name (e.g. “mypseudoname”)
```

### 4. Configurer les applications externes / Configure external apps

#### 4.1 Discord Developer Portal

URL : https://discord.com/developers/applications

Créer ou sélectionner votre application → Bot → Copy Token

OAuth2 → URL Generator

Scopes : cochez bot

Bot Permissions : cochez View Channels, Send Messages, Mention @everyone, @here, and All Roles

Copy Generated URL → inviter le bot sur votre serveur

#### 4.2 YouTube Data API v3

URL : https://console.cloud.google.com/apis/library/youtube.googleapis.com

Sélectionnez un projet → Enable

Credentials → Create Credentials → API Key → copier dans .env

#### 4.3 Twitch Developer Console

URL : https://dev.twitch.tv/console/apps

Register Your Application

Name : nom de votre bot

OAuth Redirect URLs : https://localhost (juste pour valider)

Category : Application Integration

Copy Client ID & New Secret dans .env

## 5. Démarrer le bot / Start the bot

```bash
# 🇫🇷

npm start

# 🇬🇧

npm start
```

Ne commitez jamais votre vrai .env sur GitHub !
❗ Always ignore the .env file in your .gitignore.

Bonne installation / Happy coding ! 🚀

```bash
# 🇫🇷 Empêche de committer le fichier d’environnement contenant tes secrets

# 🇬🇧 Prevent committing the environment file with your secrets

.env

# 🇫🇷 Si tu as généré d’autres fichiers non souhaités (logs, node_modules…)

# 🇬🇧 Ignore other unwanted files (logs, node_modules…)

node_modules/

*.log
```
