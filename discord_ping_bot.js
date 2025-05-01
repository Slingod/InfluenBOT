/*
Simple Discord bot that pings a specific role when:
 - A new YouTube video is posted on a specific channel
 - A Twitch channel goes live

Requirements / Prérequis :
 - Node.js v16+
 - discord.js@14
 - googleapis
 - node-fetch
 - dotenv

Instructions for collaborators / Instructions pour les collaborateurs :
1. Duplicate this file and the `.env.example` (below).  
   Dupliquez ce fichier et le `.env.example` (ci-dessous).
2. Rename `.env.example` to `.env`.  
   Renommez `.env.example` en `.env`.
3. Fill in your own values in `.env` (tokens, IDs, API keys).  
   Remplissez vos propres valeurs dans `.env` (tokens, IDs, clés API).
4. Run `npm install` then `npm start`.  
   Exécutez `npm install` puis `npm start`.
*/

// ─── IMPORTS & CONFIGURATION / IMPORTATIONS & CONFIG ───────────────────
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load variables from .env / Charge les variables depuis .env

// ─── ENVIRONMENT VARIABLES / VARIABLES D’ENVIRONNEMENT ────────────────
// Fill these in your .env file. / À remplir dans votre fichier .env
const DISCORD_TOKEN    = process.env.DISCORD_TOKEN;       // Bot Token (Developer Portal → Bot → Copy Token)  
                                                         // Token du bot (Developer Portal → Bot → Copier le token)
const GUILD_ID         = process.env.DISCORD_GUILD_ID;    // Discord Server ID (right-click server → Copy ID)  
                                                         // ID du serveur Discord (clic droit sur le serveur → Copier l’ID)
const CHANNEL_ID       = process.env.DISCORD_CHANNEL_ID;  // Channel ID for notifications (copy ID)  
                                                         // ID du salon pour notifications (clic droit → Copier l’ID)
const ROLE_ID          = process.env.DISCORD_ROLE_ID;     // ID of role to mention (copy role ID)  
                                                         // ID du rôle à mentionner (clic droit sur le rôle → Copier l’ID)

const YT_API_KEY       = process.env.YOUTUBE_API_KEY;     // YouTube Data API v3 key (Cloud Console → Credentials)  
                                                         // Clé YouTube Data API v3 (Console GCP → Identifiants)
const YT_CHANNEL_ID    = process.env.YOUTUBE_CHANNEL_ID;  // YouTube Channel ID (UC…)  
                                                         // ID de la chaîne YouTube (UC…)

const TW_CLIENT_ID     = process.env.TWITCH_CLIENT_ID;     // Twitch Client ID (dev.twitch.tv → Apps)  
                                                         // Client ID Twitch (dev.twitch.tv → Apps)
const TW_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET; // Twitch Client Secret (same page)  
                                                         // Client Secret Twitch (même page)
const TW_CHANNEL       = process.env.TWITCH_CHANNEL_NAME;  // Twitch channel name (e.g. “monpseudo”)  
                                                         // Nom de la chaîne Twitch (ex. “monpseudo”)

// ─── INTERNAL STATE / ÉTAT INTERNE ───────────────────────────────────
let lastVideoId        = null;
let twitchAccessToken  = null;
let wasLive            = false;

// ─── DISCORD CLIENT INITIALIZATION / INITIALISATION DU CLIENT DISCORD ─
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`); // Bot is ready / Bot prêt

  // Initial checks without notifications / Vérifs initiales sans notification
  await checkYouTube(true);
  await getTwitchToken();
  await checkTwitch(true);

  // Repeat every 5 minutes / Boucle toutes les 5 minutes
  setInterval(() => checkYouTube(), 5 * 60 * 1000);
  setInterval(() => checkTwitch(), 5 * 60 * 1000);
});

// ─── CHECK FOR NEW YOUTUBE VIDEO / VÉRIFICATION YOUTUBE ───────────────
async function checkYouTube(skipNotify = false) {
  const yt = google.youtube({ version: 'v3', auth: YT_API_KEY });
  const res = await yt.search.list({
    part: ['snippet'],
    channelId: YT_CHANNEL_ID,
    order: 'date',
    maxResults: 1
  });
  const video = res.data.items[0];
  if (!video) return;

  const vidId = video.id.videoId;
  if (!lastVideoId) { lastVideoId = vidId; return; }

  if (vidId !== lastVideoId) {
    lastVideoId = vidId;
    if (!skipNotify) {
      const mention = `<@&${ROLE_ID}>`;  
      await sendNotification(`${mention} Nouvelle vidéo postée ! https://youtu.be/${vidId}`);  
      // New video posted! / Nouvelle vidéo postée !
    }
  }
}

// ─── GET TWITCH ACCESS TOKEN / OBTENIR TOKEN TWITCH ──────────────────
async function getTwitchToken() {
  const url = `https://id.twitch.tv/oauth2/token`
    + `?client_id=${TW_CLIENT_ID}`
    + `&client_secret=${TW_CLIENT_SECRET}`
    + `&grant_type=client_credentials`;
  const res = await fetch(url, { method: 'POST' });
  const data = await res.json();
  twitchAccessToken = data.access_token;
}

// ─── CHECK TWITCH LIVE STATUS / VÉRIFICATION TWITCH ───────────────────
async function checkTwitch(skipNotify = false) {
    if (!twitchAccessToken) await getTwitchToken();
  
    const url = `https://api.twitch.tv/helix/streams?user_login=${TW_CHANNEL}`;
    const res = await fetch(url, {
      headers: {
        'Client-ID': TW_CLIENT_ID,
        'Authorization': `Bearer ${twitchAccessToken}`
      }
    });
    const data = await res.json();
    console.log('[Twitch API]', data); // <-- Ajout ici pour debug l'API Twitch
  
    const isLive = Array.isArray(data.data) && data.data.length > 0;
  
    if (isLive && !wasLive) {
      wasLive = true;
      if (!skipNotify) {
        const mention = `<@&${ROLE_ID}>`;
        await sendNotification(`${mention} Je suis en live ! https://twitch.tv/${TW_CHANNEL}`);  
        // I'm live! / Je suis en live !
      }
    } else if (!isLive) {
      wasLive = false;
    }
  }
  

// ─── SEND A MESSAGE TO DISCORD CHANNEL / ENVOI DANS DISCORD ────────────
async function sendNotification(message) {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return;

  const channel = guild.channels.cache.get(CHANNEL_ID);
  if (!channel || !(channel instanceof TextChannel)) return;

  channel.send({ content: message });
}

client.login(DISCORD_TOKEN); // Start the bot / Démarre le bot