import { EmbedBuilder, Interaction } from "discord.js";
import { readFileSync } from "fs";
import { PackageJson } from "../types/source";
import { Language } from "../types/language/type";
import selectLanguage from "./selectLanguage";
import DiscordClient from "../model/Client";
import EmbedData from "../storage/EmbedData";
import dbAccess from "../database/dbAccess";
import logError from "./logError";
import config from "../../config";
import os from "os";

const defaultLanguage = selectLanguage(config.discord.default_language);

export default async function (
  client: DiscordClient,
  language: Language = defaultLanguage,
  interaction?: Interaction
) {
  try {
    const readyTimestamp = client.readyTimestamp!;
    const packageJson: PackageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const totalCommands = (await dbAccess.getTotalCommandsUsed() || 0).toLocaleString();
    const statusLang = language.replies.status;

    return new EmbedBuilder()
      .setColor(EmbedData.color.theme.HexToNumber())
      .setTitle(language.replies.status.title)
      .addFields(
        [
          {
            name: `${EmbedData.emotes.default.server}| ${statusLang.guilds}`,
            value: `**\`${client.guilds.cache.size.toLocaleString()}\` ${statusLang.guildUnit || "Servers"}**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.users}| ${statusLang.users}`,
            value: `**\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\` ${statusLang.userUnit || "Users"}**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.voice}| ${statusLang.voice || "Voice Connections"}`,
            value: `**\`${client.voice.adapters.size.toLocaleString()}\` ${statusLang.channelUnit || "Channels"}**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.commands}| ${statusLang.commands}`,
            value: `**\`${client.commands.size}\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.heartbeat}| ${statusLang.ping}`,
            value: `**\`${Math.round(client.ws.ping)}\` ms | ${statusLang.totalCommands}: \`${totalCommands}\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.uptime}| ${statusLang.uptime}`,
            value: `**<t:${Math.round(readyTimestamp / 1000)}:D> | <t:${Math.round(readyTimestamp / 1000)}:R>**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.memory}| ${statusLang.memory}`,
            value: `**${Math.round(+((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)).toLocaleString()}/${Math.round(+((os.totalmem()) / 1024 / 1024).toFixed(2)).toLocaleString()} MB | \`${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.cpu}| ${statusLang.cpu}`,
            value: `**${os.cpus().map((i) => `${i.model}`)[0]} | \`${String(os.loadavg()[0])}%\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes.default.version}| ${statusLang.version}`,
            value: `**Source \`v${packageJson.version}\` | Discord.JS \`v${require(`discord.js`).version}\`**`,
            inline: false
          }
        ]
      )
      .setFooter({
        text: EmbedData.footer.footerText
          + interaction && interaction?.user
          ? EmbedData.footer.footerText + language.replies.status.refreshedBy.replaceValues({ user: interaction.user.tag })
          : "",
        iconURL: EmbedData.footer.footerIcon
      })
      .toJSON();
  }

  catch (e) {
    logError(e);
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