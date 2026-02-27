import {
  Language,
  PackageJson
} from "../types/interfaces";
import { EmbedBuilder } from "discord.js";
import { readFileSync } from "fs";
import selectLanguage from "./selectLanguage";
import DiscordClient from "../model/Client";
import EmbedData from "../storage/EmbedData";
import config from "../../config";
import error from "./error";
import os from "os";
import dbAccess from "../database/dbAccess";

const defaultLanguage = selectLanguage(config.discord.default_language);

export default async function (client: DiscordClient, language: Language = defaultLanguage) {
  try {
    const readyTimestamp = client.readyTimestamp!;
    const packageJson: PackageJson = JSON.parse(readFileSync("package.json", "utf8"));

    return new EmbedBuilder()
      .setColor(EmbedData.color.theme.HexToNumber())
      .setTitle(language.replies.status.title)
      .addFields(
        [
          {
            name: `${EmbedData.emotes.default.server}| ${language.replies.status.guilds}`,
            value: `**\`${client.guilds.cache.size.toLocaleString()}\` Servers**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.users}| ${language.replies.status.users}`,
            value: `**\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\` Users**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.commands}| ${language.replies.status.commands}`,
            value: `**\`${client.commands.size}\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.heartbeat}| ${language.replies.status.ping}`,
            value: `**\`${Math.round(client.ws.ping)}\` ms | Total Commands Used: \`${(await dbAccess.getTotalCommandsUsed() || 0).toLocaleString()}\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.uptime}| ${language.replies.status.uptime}`,
            value: `**<t:${Math.round(readyTimestamp / 1000)}:D> | <t:${Math.round(readyTimestamp / 1000)}:R>**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.memory}| ${language.replies.status.memory}`,
            value: `**${Math.round(+((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)).toLocaleString()}/${Math.round(+((os.totalmem()) / 1024 / 1024).toFixed(2)).toLocaleString()} MB | \`${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.cpu}| ${language.replies.status.cpu}`,
            value: `**${os.cpus().map((i) => `${i.model}`)[0]} | \`${String(os.loadavg()[0])}%\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.version}| ${language.replies.status.version}`,
            value: `**Source \`v${packageJson.version}\` | Discord.JS \`v${require(`discord.js`).version}\`**`,
            inline: false
          }
        ]
      ).toJSON();
  }

  catch (e) {
    error(e);
  }
}

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */