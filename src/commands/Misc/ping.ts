import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  PermissionsBitField
} from "discord.js";
import { CommandType } from "../../types/command/type";
import selectLanguage from "../../utils/selectLanguage";
import responseEdit from "../../utils/response/responseEdit";
import EmbedData from "../../storage/EmbedData";
import response from "../../utils/response/response";
import dbAccess from "../../database/dbAccess";
import logError from "../../utils/logError";
import config from "../../../config";
import os from "os";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.ping;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "ping",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      "SendMessages",
    ]),
    default_bot_permissions: new PermissionsBitField([
      "SendMessages",
      "EmbedLinks"
    ]),
    dm_permission: true,
    options: [
      {
        name: "ephemeral",
        description: ephemeral.description,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: ephemeral.choices.yes,
            value: "true"
          },
          {
            name: ephemeral.choices.no,
            value: "false"
          }
        ],
        required: false
      }
    ]
  },
  category: "misc",
  cooldown: 10,

  run: async (client, interaction) => {
    try {
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang).commands.ping;
      const embed1 = new EmbedBuilder()
        .setColor(EmbedData.color.theme.HexToNumber())
        .setDescription(language.replies.pinging);

      await response(interaction, { embeds: [embed1] });

      const embed2 = new EmbedBuilder()
        .setColor(EmbedData.color.theme.HexToNumber())
        .setThumbnail(client.user!.displayAvatarURL({ forceStatic: true }))
        .setFooter({
          text: EmbedData.footer.footerText,
          iconURL: EmbedData.footer.footerIcon,
        })
        .setTitle(`${EmbedData.emotes.default.ping} ${language.replies.ping}`)
        .setFields(
          [
            {
              name: `\u200b`,
              value: `**${EmbedData.emotes.default.heartbeat}| ${language.replies.values.pinging} \`${Math.round(client.ws.ping)}\` ms**`,
              inline: true
            },
            {
              name: `\u200b`,
              value: `**${EmbedData.emotes.default.timer}| ${language.replies.fields.time} \`${Date.now() - interaction.createdTimestamp}\` ms**`,
              inline: true
            },
            {
              name: `\u200b`,
              value: `**${EmbedData.emotes.default.uptime}| ${language.replies.fields.uptime} <t:${Math.round(client.readyTimestamp! / 1000)}:D> | <t:${Math.round(client.readyTimestamp! / 1000)}:R>**`,
              inline: true
            },
            {
              name: `${EmbedData.emotes.default.memory}| ${language.replies.fields.memory}`,
              value: `${EmbedData.emotes.default.reply} **${Math.round(+((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)).toLocaleString()}/${Math.round(+((os.totalmem()) / 1024 / 1024).toFixed(2)).toLocaleString()} MB | \`${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%\`**`
            }
          ]
        )
        .setTimestamp();

      return await responseEdit(interaction, { embeds: [embed2] });
    }

    catch (e) {
      logError(e)
    }
  }
} as CommandType;

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */