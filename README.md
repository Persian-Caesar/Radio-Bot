<div align="center">
    <img src="https://badges.aleen42.com/src/npm.svg">
    <img src="https://badges.aleen42.com/src/node.svg">
    <img src="https://badges.aleen42.com/src/javascript.svg">
    <img src="https://img.shields.io/github/v/release/Sobhan-SRZA/Radio-Bot?label=Version">
    <div>
        <img src="https://img.shields.io/github/license/Sobhan-SRZA/Radio-Bot?label=License">
        <img src="https://img.shields.io/github/last-commit/Sobhan-SRZA/Radio-Bot?label=Last Commit">
        <img src="https://img.shields.io/github/release-date/Sobhan-SRZA/Radio-Bot?label=Last Release">
    </div>
    <img src="https://img.shields.io/github/forks/Sobhan-SRZA/Radio-Bot?label=Forks">
    <img src="https://img.shields.io/github/stars/Sobhan-SRZA/Radio-Bot?label=Stars">
    <img src="https://img.shields.io/github/watchers/Sobhan-SRZA/Radio-Bot?label=Watchers">
    <img src="https://img.shields.io/github/languages/code-size/Sobhan-SRZA/Radio-Bot?label=Code Size">
    <img src="https://img.shields.io/github/directory-file-count/Sobhan-SRZA/Radio-Bot?label=Files">
    <div>
        <img style="display:block;margin-left:auto;margin-right:auto;width:30%;" src="https://github-readme-stats.vercel.app/api/pin/?username=Sobhan-SRZA&repo=Radio-Bot&theme=react">
    </div>
</div>

---

# 🎧 Discord Radio Bot 📻

This is an advanced radio bot for Discord voice channels, allowing users to enjoy a wide variety of trending online radios with high quality and seamless performance.

## Features ✨
- **Seamless Performance**: Enjoy lag-free, high-quality audio playback.
- **Wide Variety of Radio Stations**: Stream trending online radio stations in high quality.
- **Multilingual Support**: Padio supports multiple languages. 🌍
  - English (Default)
  - فارسی (Farsi)
  - Türkçe (Turkish - Istanbul)
  - 中文 (Chinese)
  - 日本語 (Japanese)
  - ภาษาไทย (Thai)

- **Customizable Prefix**: Tailor the bot to your server’s needs by setting a custom command prefix.
- **User-Friendly Panel**: An intuitive panel for managing radio playback and settings from within Discord.
- **Station Switching**: Change radio stations effortlessly! 🎵
- **AFK Channel Reconnection**: Automatically rejoin pre-configured AFK channels from the server’s database.
- **High-Quality Streaming**: Experience smooth, lag-free audio. ⚡
- **Clean and Editable Code**: Well-structured for new developers to easily customize. 🧹
- **Database Support**: Compatible with multiple databases like SQL, JSON, Docker, and MongoDB. 💾
- **Audio Format Support**: Play audio from various formats such as OGG, MP3, MP4, MKV, and M4A (coming soon).

--- 

## All Commands 📜

### 📠 | Admin Commands:
- `/setup panel` | `p!setup panel`  
  **Description**: Create a radio control panel for quick and easy management.
  
- `/setup prefix` | `p!setup prefix`  
  **Description**: Set a custom prefix for bot commands.
  
- `/setup language` | `p!setup language`  
  **Description**: Change the bot’s language to suit your server’s needs.

### 🎧 | Music Commands:
- `/afk` | `p!afk [channel | id]`  
  **Description**: Enable AFK mode for a specified voice channel.

- `/pause` | `p!pause`  
  **Description**: Temporarily stop the player.

- `/resume` | `p!resume`  
  **Description**: Resume the player.

- `/play` | `p!play`  
  **Description**: Play a radio station in the voice channel.

- `/stop` | `p!stop`  
  **Description**: Stop the radio playback and remove the player from the voice channel.

- `/volume` | `p!volume [1-200]`  
  **Description**: Adjust the player’s volume or display the current volume level.

### 🔧 | Misc Commands:
- `/about` | `p!about`  
  **Description**: Displays information about the bot.
  
- `/help` | `p!help`  
  **Description**: Display the list of available bot commands.
  
- `/invite` | `p!invite`  
  **Description**: Get the invite link for the bot.
  
- `/ping` | `p!ping`  
  **Description**: Display the bot’s ping.

- `/report` | `p!report`  
  **Description**: Report any issues or bugs related to the bot.

### 👑 | Owner (For Developers) Commands:
- `p!setactivity [status:[dnd|online|idle|invisible] type:[Playing|Streaming|Listening|Watching|Custom|Competing] name:[string] url:[url|link]]`  
  **Description**: Temporarily change the bot’s status.

- `p!guilds [id]`  
  **Description**: Display the list of servers the bot has joined.

---

## Installation and Setup 📦

### 1. Download and Install
Clone or download the project files:
```bash
git clone https://github.com/Sobhan-SRZA/Radio-Bot.git
cd Radio-Bot
```

Install all dependencies:
```bash
npm i
```

### 2. Configure the Environment Variables (.env) ⚙️
Create a `.env` file from the example file:
```bash
cp .env.example .env
```

Now, edit the `.env` file and add your bot’s required information. Here are the details for each field:

### `.env` Configuration

| Variable                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `token`                  | **Bot Token**: The token for your Discord bot. You can generate this in the [Discord Developer Portal](https://discord.com/developers/applications). Example: `token="Your Discord Bot Token"`.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `prefix`                 | **Command Prefix**: The prefix used before commands. Example: `prefix="!"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `status_activity`        | **Bot Status Activity**: Set the status message for the bot. You can use placeholders like `{members}` to show the number of members, `{servers}` to show the number of servers, `{usedCommands}` to show the total number of commands used, `{joinedVoiceChannels}` to show how many voice channels the bot has joined, or `{prefix}` to show the bot's default prefix. Example: `status_activity="["Use {prefix}help or /help to see bot features.", "Working in {servers} Servers", "Work for {members} Members", "Total Used Commands {usedCommands}", "Playing In {joinedVoiceChannels} Voice Channels"]"`. |
| `status_type`            | **Bot Status Type**: Choose the type of status, such as `"Playing"`, `"Listening"`, `"Watching"`, etc. Example: `status_type="["Playing"]"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `status_presence`        | **Bot Presence**: Define whether the bot appears online, idle, or DND (Do Not Disturb). Example: `status_presence="["online"]"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `database_type`          | **Database Type**: Choose the database type to store user and server data. Supported values: `"json"`, `"mysql"`, `"mongodb"`. Example: `database_type="json"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `database_mongoURL`      | **MongoDB URL**: If using MongoDB, set the connection URL. Example: `database_mongoURL="mongodb+srv://user:password@cluster.mongodb.net/dbname"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `database_msql_host`     | **MySQL Host**: The host for your MySQL database if using MySQL. Example: `database_msql_host="localhost"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `database_msql_user`     | **MySQL User**: Your MySQL database username. Example: `database_msql_user="root"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `database_msql_password` | **MySQL Password**: Your MySQL database password. Example: `database_msql_password="password"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `database_msql_database` | **MySQL Database Name**: The name of your MySQL database. Example: `database_msql_database="dbname"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `support_id`             | **Support Server ID**: The ID of your support Discord server. Example: `support_stats="Some Server ID"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `support_url`            | **Support Server URL**: The invite link to your support server. Example: `support_url="https://discord.gg/inviteCode"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `support_stats`          | **Bot Stats Channel ID**: The ID of the channel where bot stats should be sent. Example: `support_stats="Some Channel ID"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `webhook_url`            | **Webhook Logger URL**: A Discord webhook URL to log important information. Example: `webhook_url="Some Webhook URL"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `webhook_avatar`         | **Webhook Avatar**: URL to an avatar image for the webhook logger. Example: `webhook_avatar="Some Image URL"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `webhook_username`       | **Webhook Username**: Name displayed when the webhook posts messages. Example: `webhook_username="Bot Logger"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `webhook_thread_bugs`    | **Bug Report Thread ID**: The ID of the thread for logging errors. Example: `webhook_thread_bugs="Some Thread ID"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `webhook_thread_report`  | **User Report Thread ID**: The ID of the thread for logging user reports. Example: `webhook_thread_report="Some Thread ID"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `webhook_thread_status`  | **Status Alerts Thread ID**: The ID of the thread for status alerts. Example: `webhook_thread_status="Some Thread ID"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `owners`                 | **Bot Owners**: List of Discord IDs that are considered bot owners. Example: `owners="["123456789012345678", "987654321098765432"]"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `default_language`       | **Default Language**: The default language the bot should use. Example: `default_language="en"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `anti_crash`             | **Anti-Crash Controller**: Enable or disable the anti-crash controller. Example: `anti_crash=true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `one_guild`              | **One Guild Mode**: Restrict bot to one guild only. Example: `one_guild=true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `logger`                 | **Error Logging**: Enable or disable sending errors to Discord via webhook. Example: `logger=true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `dashboard`              | **Enable Dashboard**: Whether the web-based dashboard is enabled or not. Example: `dashboard=true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `dashboard_port`         | **Dashboard Port**: The port number for the dashboard to run on. Example: `dashboard_port=3000`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `dashboard_host`         | **Dashboard Host URL**: The host URL for the dashboard. Example: `dashboard_host="http://localhost:3000"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

### 3. Run the Bot 🚀
Once you’ve configured the `.env` file, you can start the bot by running:
```bash
npm start
```

---

## Technologies Used 🛠️
This bot is built using **Node.js** and utilizes the following key packages:

| Packages                                                               | Version         | Install                          |
| ---------------------------------------------------------------------- | --------------- | -------------------------------- |
| [discord.js](https://www.npmjs.com/package/discord.js)                 | Latest ^14.16.2 | `npm install discord.js`         |
| [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)     | Latest ^0.17.0  | `npm install @discordjs/voice`   |
| [dotenv](https://www.npmjs.com/package/dotenv)                         | Latest ^16.4.5  | `npm install dotenv`             |
| [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static)           | Latest ^5.2.0   | `npm install ffmpeg-static`      |
| [quick.db](https://www.npmjs.com/package/quick.db)                     | Latest ^9.1.7   | `npm install quick.db`           |
| [cli-color](https://www.npmjs.com/package/cli-color)                   | Latest ^2.0.4   | `npm install cli-color`          |
| [libsodium-wrappers](https://www.npmjs.com/package/libsodium-wrappers) | Latest ^0.7.15  | `npm install libsodium-wrappers` |
| [opusscript](https://www.npmjs.com/package/opusscript)                 | Latest ^0.0.8   | `npm install opusscript`         |

---

## Getting Help 🆘
**Coded by** [Sobhan-SRZA](https://github.com/Sobhan-SRZA) for [Persian Caesar](https://dsc.gg/persian-caesar).
For support and assistance, join our [Discord server](https://discord.gg/AfkuXgCKAQ).

---

## License 📜
This project is licensed under the **BSD-3-Clause** License. Please give credit to "Persian Caesar" if you face issues using this code.

---

## Contact 📞
<div align="center">
  <a href="https://srza.ir" target="_blank">
   <img align="left" src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/social.png" alt="Sobhan-SRZA social" width=400px>
  </a>

  <a href="https://t.me/d_opa_mine" target="_blank">
   <img alt="Telegram"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/telegram-ch.svg"
    height="30" />
  </a>

  <a href="https://t.me/Sobhan_SRZA" target="_blank">
   <img alt="Telegram"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/telegram-ac.svg"
    height="30" />
  </a>

  <a href="https://www.instagram.com/mr.sinre?igsh=cWk1aHdhaGRnOGg%3D&utm_source=qr" target="_blank">
   <img alt="Instagram"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/instagram.svg"
    height="30" />
  </a>

  <a href="https://www.twitch.tv/sobhan_srza" target="_blank">
   <img alt="Twitch"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/twitch.svg"
    height="30" />
  </a>

  <a href="https://www.youtube.com/@mr_sinre?app=desktop&sub_confirmation=1" target="_blank">
   <img alt="YouTube"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/youtube.svg"
    height="30" />
  </a>
  
  <a href="https://github.com/Sobhan-SRZA" target="_blank">
   <img alt="Github"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/github.svg"
    height="30" />
  </a>
  
  <p align="left">
   <a href="https://discord.gg/xh2S2h67UW" target="_blank">
    <img src="https://discord.com/api/guilds/1054814674979409940/widget.png?style=banner2" alt="pc-development.png">
   </a>
  </p>

  <p align="right">
   <a href="https://discord.gg/54zDNTAymF" target="_blank">
    <img src="https://discord.com/api/guilds/1181764925874507836/widget.png?style=banner2" alt="pc-club.png">
   </a>
  </p>

  <div align="center">
   <a href="https://discord.com/users/865630940361785345" target="_blank">
    <img alt="My Discord Account" src="https://discord.c99.nl/widget/theme-1/865630940361785345.png" />
   </a>
    <a href="https://discord.com/users/986314682547716117" target="_blank" align="right">
    <img alt="Team Discord Account" src="https://discord.c99.nl/widget/theme-1/986314682547716117.png" />
   </a>
  </div>

 </div>

</div>
