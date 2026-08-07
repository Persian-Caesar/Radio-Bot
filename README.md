# Padio (Persian Caesar Discord Radio Bot) 
**A High-Performance Radio & Utility Bot for Discord**  
*Developed by Sobhan-SRZA (mr.sinre)*  
GitHub: [Persian-Caesar](https://github.com/Persian-Caesar) | Support: [dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)  

> **Version:** `0.0.5`  
> **Developed by:** Sobhan-SRZA (mr.sinre)  
> **GitHub:** [https://github.com/Sobhan-SRZA](https://github.com/Sobhan-SRZA)  
> **Support Server:** [https://dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)  
> **Copyright © Persian Caesar** – All rights reserved.

---

## Overview  
**Persian Caesar Radio Bot** is a **Discord voice radio bot** built using **TypeScript** and **Discord.js v14**, designed to stream high-quality online radio stations directly into voice channels. It features:  
- Online radio streaming with voice channel control panels  
- Slash & message command hybrid system  
- Multi-language support (`en`, `per`, `jp`, `th`, `tr`, `zh`)  
  - English (Default)
  - فارسی (Farsi)
  - Türkçe (Turkish - Istanbul)
  - 中文 (Chinese)
  - 日本語 (Japanese)
  - ภาษาไทย (Thai)

- Dynamic status updates & server statistics  
- Cooldowns, permissions, and owner-only commands  
- QuickDB integration (JSON, MySQL, SQLite, MongoDB)  
- Advanced logging & error reporting via webhooks  
- Database support: JSON, MySQL, SQLite, MongoDB
- Slash & message commands with autocomplete
- Anti-crash, error webhook logging, status loop
- Owner-only commands, cooldown, permission checks

## **How It Works (Architecture)**

```
Client (DiscordClient)
│
├── Events → interactionCreate, ready, guildCreate/Delete
├── Handlers → Load commands & events
├── Utils → Helper functions (response, error, cooldown, etc.)
├── Storage → Embed data, radio stations, language list
├── Types → Interfaces, global extensions
├── Model → Client, Database, PlayerManager
└── locales/ → Language JSON files
```

### Key Features:
- Play **50+ radio stations** (Persian Rap, Lofi, Anime, EDM, etc.)
- **Customizable per-server settings** (prefix, language, AFK channel, radio panel)
- **Interactive control panel** with buttons and select menus
- **Multilingual support** (English, Persian, Turkish, Chinese, Japanese, Thai)
- **Database support**: JSON, MySQL, SQLite, MongoDB
- **Slash & message commands**
- **Anti-crash system**, **error logging to Discord webhook**
- **Status loop**, **presence rotation**, **uptime tracking**
- **AFK mode**, **voice channel management**, **volume control**
- **Owner-only commands**, **cooldown system**, **permission checks**

---

## Core Features  

| Feature                     | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| **Radio Player**            | Stream high-quality online radio stations in voice channels          |
| **Control Panel**           | Interactive message panel with station selector                      |
| **AFK Mode**                | Auto-resume playback if users leave voice                            |
| **Slash & Prefix Commands** | Full hybrid command support                                          |
| **Multilingual**            | 6 languages with dynamic switching                                   |
| **Database Flexibility**    | JSON, MySQL, SQLite, MongoDB                                         |
| **Auto Status Updates**     | Live bot stats in support server                                     |
| **Error Logging**           | Webhook-based crash & error reporting                                |
| **Custom Extensions**       | Global `.toCapitalize()`, `.replaceValues()`, `.HexToNumber()`, etc. |

### Core Flow:
1. **Bot starts** → Loads config → Connects to database → Loads commands/events
2. **User runs command** → `interactionCreate` → Permission & cooldown check → Execute command
3. **Radio play** → `play` command → Join voice → Stream from URL → Create control panel
4. **Panel interaction** → Button/menu → Update player state (pause, resume, volume, stop)

---

## **Policies & Guidelines**

- **Credit Required**: You **must** credit **"Persian Caesar"** in any public use, documentation, or communication.
- **No Token Sharing**: Never expose `.env` or bot token.
- **No Malicious Use**: Do not use for spam, harassment, or illegal activities.
- **Forking Allowed**: You may fork, but **keep the copyright notice**.
- **Support**: Issues → Open GitHub issue or join support server.

---

## **Technologies & Packages**

| Package              | Version    | Purpose                                                      |
| -------------------- | ---------- | ------------------------------------------------------------ |
| `@discordjs/opus`    | `^0.10.0`  | Opus audio encoder/decoder for voice                         |
| `@discordjs/voice`   | `^0.19.2`  | Voice connection & audio streaming                           |
| `@snazzah/davey`     | `^0.1.12`  | Utility for Discord.js (used in extensions)                  |
| `colors`             | `^1.4.0`   | Colored console output (fallback for `chalk`)                |
| `discord.js`         | `^14.27.0` | Discord API wrapper                                          |
| `dotenv`             | `^17.4.2`  | Load environment variables from `.env`                       |
| `ffmpeg-static`      | `^5.3.0`   | Static FFmpeg binary for audio processing                    |
| `libsodium-wrappers` | `^0.8.4`   | Sodium encryption for voice (required by `@discordjs/voice`) |
| `quick.db`           | `^9.1.7`   | Lightweight database (JSON/MySQL/SQLite)                     |
| `quickmongo`         | `^5.2.0`   | MongoDB driver (optional)                                    |
| `typescript` (dev)   | `^7.0.2`   | TypeScript compiler                                          |
| `@types/node` (dev)  | `^26.1.2`  | Node.js type definitions                                     |

> **Node.js Version**: `>=18.0.0`

---

## Project Structure  

```
src/
├── index.ts                    → Entry point
├── config.ts                   → Config file befor compile
├── .env                        → env file for setup (you can use config.ts btw it's optional)
├── README.md                   # This file. (Documents)
├── events/                     # Event listeners
│   ├── autocomplete/
│   │   └── interactionCreate.ts
│   ├── button/
│   │   └── interactionCreate.ts
│   ├── change status/
│   │   └── clientReady.ts
│   ├── guilds logger/
│   │   ├── guildCreate.ts
│   │   └── guildDelete.ts
│   ├── message command handler/
│   │   └── messageCreate.ts
│   ├── radio/
│   │   ├── clientReady.ts
│   │   ├── interactionCreate.ts
│   │   └── voiceStateUpdate.ts
│   ├── report/
│   │   └── interactionCreate.ts
│   ├── slash command handler/
│   │   └── interactionCreate.ts
│   └── trigger/
│       ├── clientReady.ts
│       └── interactionCreate.ts
├── functions/                   # Utility functions
│   ├── logger.ts
│   ├── post.ts
│   ├── setupGlobalExtensions.ts
│   ├── sleep.ts
│   └── strToMs.ts
├── handlers/                    # Command & event loaders
│   ├── commandHandler.ts
│   └── eventsHandler.ts
├── model/                       # Core classes
│   ├── Client.ts
│   ├── Database.ts
│   └── PlayerManager.ts
├── types/                       # TypeScript interfaces & types
│   ├── database.ts              → DB type aliases
│   ├── global.d.ts              → Global extensions
│   ├── interfaces.ts            → Command, Language, Config
│   └── types.ts                 → General types
├── utils/                       # Helper utilities
│   ├── checkCmdCooldown.ts
│   ├── checkCmdPerms.ts
│   ├── checkPlayerPerms.ts
│   ├── database.ts
│   ├── dbAccess.ts
│   ├── error.ts
│   ├── getAuthor.ts
│   ├── GetInvite.ts
│   ├── interactionTools.ts
│   ├── repeatAction.ts
│   ├── response.ts
│   ├── responseDelete.ts
│   ├── responseEdit.ts
│   ├── responseError.ts
│   ├── selectLanguage.ts
│   ├── SendGuildAlert.ts
│   ├── StatusEmbedBuilder.ts
│   └── yes-or-no.ts
├── commands/
│   ├── Admin/setup.ts           → Server setup (panel, prefix, language)
│   ├── Misc/
│   │   ├── about.ts             → Bot stats & updates
│   │   ├── help.ts              → Interactive help menu
│   │   ├── invite.ts            → Invite links
│   │   ├── ping.ts              → Latency & system stats
│   │   └── report.ts            → Report system
│   ├── Music/
│   │   ├── afk.ts               → Set AFK voice channel
│   │   ├── pause.ts             → Pause radio
│   │   ├── play.ts              → Play station (autocomplete)
│   │   ├── resume.ts            → Resume radio
│   │   ├── stop.ts              → Stop radio
│   │   └── volume.ts            → Volume control
│   └── Owner/
│       ├── guilds.ts            → List all guilds (pagination)
│       └── setactivity.ts       → Set custom presence
└── storage/
    ├── locales/
    │   ├── en.json              → English
    │   ├── per.json             → فارسی
    │   ├── tr.json              → Türkçe
    │   ├── zh.json              → 中文
    │   ├── jp.json              → 日本語
    │   └── th.json              → ภาษาไทย
    ├── EmbedData.ts             → Colors, emotes, footer
    ├── languages.json           → List of supported languages
    └── radiostation.json        → All radio URLs
```

> **Note**: `locales/*.json` files contain full translation for all bot messages.


---

## Key Changes & Fixes (Latest Update)

| File               | Change                              | Description                                                                                                       |
| ------------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `clientReady.ts`   | **Fixed `stats_channel` reference** | Previously used invalid `config.discord.support.stats_channel`. Now safely falls back to `support.id` if missing. |
| `PlayerManager.ts` | **Improved stream handling**        | Uses `fetch()` with `AbortController` for timeout safety                                                          |
| `dbAccess.ts`      | **Fixed `deletePrefix` typo**       | Was deleting `language` instead of `prefix`                                                                       |
| `global.d.ts`      | **Global prototype extensions**     | `.random()`, `.chunk()`, `.replaceValues()`, etc.                                                                 |
| `error.ts`         | **Webhook error logging**           | Sends full stack trace + file attachment if >4096 chars                                                           |

---

## Setup Guide  

### 1. **Clone & Install**
```bash
git clone https://github.com/Persian-Caesar/Persian-Caesar.git
cd Persian-Caesar
npm install
```

### 2. **Configuration (`config.ts` or `.env`)**
#### Example for .env (see `example.env`):
```env
token='YOUR_BOT_TOKEN'
prefix='!'
default_language='en'
database_type='json'
webhook_url='https://discord.com/api/webhooks/...'
owners='["123456789"]'
anti_crash='true'
logger='true'
```

#### Example for config.ts:
```ts
discord: {
  token: "YOUR_BOT_TOKEN",
  default_language: "en",
  prefix: "!",
  default_invite: "https://discord.com/oauth2/authorize?client_id={clientId}&scope=bot%20applications.commands&permissions=274878258176"
},
source: {
  database: {
    type: "json", // json | mysql | sql | mongodb
    mysql: { host, user, password, database },
    mongoURL: "mongodb://..."
  },
  logger: true,
  anti_crash: true
}
```

### 3. **Run**
```bash
npm run build    # Compile TS → JS
npm start        # Start bot
```

---

## Command System  

### **Hybrid Commands**
- **Slash-only**: `only_slash: true`
- **Message-only**: `only_message: true`
- **Both**: Omit both flags

### **Cooldowns**
```ts
cooldown: 5 // seconds
```

### **Permissions**
```ts
default_member_permissions: PermissionsBitField.Flags.Administrator
default_bot_permissions: PermissionsBitField.Flags.SendMessages
```

---

## **Key Classes & Functions**

### `DiscordClient` (model/Client.ts)
```ts
class DiscordClient extends Client {
  commands: Collection<string, CommandType>;
  cooldowns: Collection<string, Collection<string, number>>;
  db?: Database;
  readyTimestamp?: number;
  player: PlayerManager;

  constructor() {
    super({ intents: [...] });
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.player = new PlayerManager(this);
  }
}
```

### `PlayerManager` (model/PlayerManager.ts)
```ts
class PlayerManager {
  client: DiscordClient;
  players: Map<string, RadioPlayer>;

  play(guildId: string, station: string) { ... }
  pause(guildId: string) { ... }
  resume(guildId: string) { ... }
  stop(guildId: string) { ... }
  setVolume(guildId: string, volume: number) { ... }
}
```

### `checkCmdPerms` (utils/checkCmdPerms.ts)
```ts
const hasPerm = await checkCmdPerms(interaction, command);
if (hasPerm) return;
```

### `response` (utils/response.ts)
```ts
await response(interaction, { content: "Hello!" });
```

### `selectLanguage` (utils/selectLanguage.ts)
```ts
const lang = selectLanguage("per"); // Returns full language object
```

### Global Extensions (types/global.d.ts)
```ts
"hello {name}".replaceValues({ name: "world" }) // → "hello world"
[1,2,3].random() // → 2
"#ff0000".HexToNumber() // → 16711680
"123".convertToPersianString() // → "۱۲۳"
```

---

## Music & Radio System  

### **Player Features**
- Queue shuffling
- Auto-reconnect
- Volume control (0–200%)
- Pause/resume
- Error recovery

### **Control Panel**
- Dropdown menu with radio stations
- Persistent message in text channel
- Auto-update on interaction

---

## **Localization System**

All text is stored in `locales/*.json`.

### Example: `locales/en.json`
```json
{
  "replies": {
    "error": "An error occurred!",
    "noChannelError": "You must be in a voice channel."
  },
  "commands": {
    "setup": {
      "description": "Configure bot settings"
    }
  }
}
```

### Usage:
```ts
const lang = selectLanguage(guildLang);
await response(interaction, { content: lang.replies.error });
```

---

## Database (QuickDB Wrapper)

| Method                                | Usage                      |
| ------------------------------------- | -------------------------- |
| `dbAccess.getLanguage(guildId)`       | Get server language        |
| `dbAccess.setLanguage(guildId, data)` | Set server language        |
| `dbAccess.deleteLanguage(guildId)`    | Delete server language     |
| `dbAccess.getPrefix(guildId)`         | Get server prefix          |
| `dbAccess.setPrefix(guildId, data)`   | Set server prefix          |
| `dbAccess.deletePrefix(guildId)`      | Delete server prefix       |
| `dbAccess.getPanel(guildId)`          | Get radio panel data       |
| `dbAccess.setPanel(guildId, data)`    | Set radio panel data       |
| `dbAccess.deletePanel(guildId)`       | Delete radio panel data    |
| `dbAccess.getAfk(guildId)`            | Get AFK channel ID         |
| `dbAccess.setAfk(guildId, data)`      | Set AFK channel ID         |
| `dbAccess.deleteAfk(guildId)`         | Delete AFK channel         |
| `dbAccess.getStation(guildId)`        | Get current radio station  |
| `dbAccess.setStation(guildId, data)`  | Set current radio station  |
| `dbAccess.deleteStation(guildId)`     | Delete radio station       |
| `dbAccess.getStatus(guildId)`         | Get status message ID      |
| `dbAccess.setStatus(guildId, data)`   | Set status message ID      |
| `dbAccess.deleteStatus(guildId)`      | Delete status message ID   |
| `dbAccess.getTotalCommandsUsed()`     | Get total commands used    |
| `dbAccess.addTotalCommandsUsed(data)` | Add to total commands used |
| `dbAccess.setTotalCommandsUsed(data)` | Set total commands used    |
| `dbAccess.deleteTotalCommandsUsed()`  | Delete total commands used |

Supports: **JSON**, **MySQL**, **SQLite**, **MongoDB**

---

## Commands Reference  

| Command           | Description                                                                          | Usage (Slash)                           | Usage (Message)                                                                                       | Category | Permissions (User/Bot)                                     | Cooldown (s) |
| ----------------- | ------------------------------------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------- | ------------ |
| `/setup panel`    | Creates an interactive radio control panel in a text channel for selecting stations. | `/setup panel [channel: #text-channel]` | `!setup panel [#text-channel]`                                                                        | Admin    | Manage Guild / Send Messages, Embed Links                  | 10           |
| `/setup prefix`   | Sets or resets a custom command prefix for the server.                               | `/setup prefix [input: new_prefix]`     | `!setup prefix [new_prefix]`                                                                          | Admin    | Manage Guild / Send Messages                               | 10           |
| `/setup language` | Sets or resets the bot's language for the server.                                    | `/setup language [input: lang_code]`    | `!setup language [lang_code]`                                                                         | Admin    | Manage Guild / Send Messages                               | 10           |
| `/about`          | Displays bot stats (guilds, users, commands, ping, uptime, memory, CPU, version).    | `/about`                                | `!about`                                                                                              | Misc     | Send Messages / Send Messages, Embed Links                 | 10           |
| `/help`           | Shows an interactive menu with all commands, categorized.                            | `/help`                                 | `!help`                                                                                               | Misc     | Send Messages / Send Messages, Embed Links                 | 10           |
| `/invite`         | Provides bot invite links (recommended, no-perm, and listing sites).                 | `/invite`                               | `!invite`                                                                                             | Misc     | Send Messages / Send Messages, Embed Links                 | 10           |
| `/ping`           | Shows bot latency (WS ping, API, uptime, memory usage).                              | `/ping`                                 | `!ping`                                                                                               | Misc     | Send Messages / Send Messages, Embed Links                 | 10           |
| `/report`         | Opens a modal to report issues; sends to support webhook with guild info.            | `/report`                               | `!report`                                                                                             | Misc     | Send Messages / Send Messages, Embed Links                 | 10           |
| `/afk`            | Sets a voice channel as AFK (auto-reconnects and resumes playback).                  | `/afk [channel: #voice-channel]`        | `!afk [#voice-channel]`                                                                               | Music    | Manage Guild / Send Messages, Embed Links, Connect, Speak  | 5            |
| `/pause`          | Pauses the current radio playback.                                                   | `/pause`                                | `!pause`                                                                                              | Music    | Send Messages / Send Messages, Embed Links, Connect, Speak | 5            |
| `/resume`         | Resumes paused radio playback.                                                       | `/resume`                               | `!resume`                                                                                             | Music    | Send Messages / Send Messages, Embed Links, Connect, Speak | 5            |
| `/play`           | Plays a radio station (autocomplete from list); restricted to panel channel if set.  | `/play [station: station_name]`         | `!play [station_name]`                                                                                | Music    | Send Messages / Send Messages, Embed Links, Connect, Speak | 5            |
| `/stop`           | Stops playback and disconnects from voice.                                           | `/stop`                                 | `!stop`                                                                                               | Music    | Send Messages / Send Messages, Embed Links, Connect, Speak | 5            |
| `/volume`         | Sets/displays volume (1-200%); shows current if no input.                            | `/volume [input: 1-200]`                | `!volume [1-200]`                                                                                     | Music    | Send Messages / Send Messages, Embed Links, Connect, Speak | 5            |
| `/guilds`         | Lists all servers the bot is in (paginated; owner-only).                             | N/A (message-only)                      | `!guilds [guild_id]`                                                                                  | Owner    | Send Messages / Send Messages                              | 5            |
| `/setactivity`    | Temporarily sets bot presence (owner-only).                                          | N/A (message-only)                      | `!setactivity status:[online/idle/dnd/invisible] type:[Playing/Streaming/...] name:[text] url:[link]` | Owner    | Send Messages / Send Messages                              | 5            |

---

## Logging & Error Handling  

### **Console Logger**
- Color-coded with `chalk`
- Supports strings, objects, booleans

### **Discord Webhook Logger**
- Sends errors to support server
- Thread-specific routing
- File attachment for long stacks

---

## Global Extensions (via `setupGlobalExtensions.ts`)

| Method                      | Example                                                 |
| --------------------------- | ------------------------------------------------------- |
| `.toCapitalize()`           | `"hello world".toCapitalize()` → `Hello World`          |
| `.replaceValues(obj)`       | `"{name} is {age}".replaceValues({name:"Ali", age:20})` |
| `.HexToNumber()`            | `"#ff0000".HexToNumber()` → `16711680`                  |
| `.convertToPersianString()` | `"123".convertToPersianString()` → `۱۲۳`                |
| `.random()`                 | `[1,2,3].random()` → `2`                                |
| `.chunk(size)`              | `[1,2,3,4].chunk(2)` → `[[1,2],[3,4]]`                  |

---

## Events

| Event                        | Purpose                       |
| ---------------------------- | ----------------------------- |
| `interactionCreate` (slash)  | Handle slash commands         |
| `interactionCreate` (button) | Refresh status embed          |
| `clientReady`                | Start status updater interval |

---

## Utilities

| Utility                          | Function                       |
| -------------------------------- | ------------------------------ |
| `repeatAction()`                 | Retry failed Discord API calls |
| `response()` / `responseError()` | Unified reply/edit system      |
| `checkCmdCooldown()`             | Per-user cooldown enforcement  |
| `checkCmdPerms()`                | Bot & user permission checks   |
| `StatusEmbedBuilder()`           | Dynamic bot stats embed        |

---

## Language System

### **Supported Languages**
`en` | `per` (Persian) | `jp` | `th` | `tr` | `zh`

### **Switch Language**
```ts
/setup language <lang>
```
 
---

## **Error Handling**

- All errors → `error(e)` → Sent to webhook if `logger: true`
- Anti-crash → Wraps critical sections
- `repeatAction` → Retries failed interactions

---

## **Deployment Tips**

- Use **PM2** or **systemd** for production
- Set `NODE_ENV=production`
- Use **MongoDB** for large-scale
- Enable `logger: true` in production

---

## **Contributing**

1. Fork the repo
2. Create branch: `feature/my-feature`
3. Commit with **English comments**
4. Open PR with description
5. **Credit Persian Caesar**

---

## Support & Community

| Platform       | Link                                                            |
| -------------- | --------------------------------------------------------------- |
| Support Server | [dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)          |
| GitHub         | [github.com/Persian-Caesar](https://github.com/Persian-Caesar)  |
| Vote           | [top.gg/bot/padio](https://top.gg/bot/1282618377654898731/vote) |

---

## Credits & License

> **Code by Sobhan-SRZA (mr.sinre)**  
> **Developed for Persian Caesar**  
> 
> **If you use this code, you must credit "Persian Caesar" in your project.**

```
BSD 3-Clause License

Copyright (c) 2025-2024, Sobhan-SRZA (mr.sinre) & Persian Caesar
All rights reserved.

You are allowed to:
- Use privately
- Modify
- Fork

You must:
- Keep copyright notice
- Credit "Persian Caesar" in docs
- Not sell or claim as your own
```
---

**Persian Caesar – Powering Discord with Music, Intelligence, and Elegance.**  
*Keep the servers alive. Keep the music playing.*