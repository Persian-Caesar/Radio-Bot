import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField
} from "discord.js";
import { CommandType } from "../../types/command/type";
import StatusEmbedBuilder from "../../components/StatusEmbedBuilder";
import selectLanguage from "../../components/selectLanguage";
import EmbedData from "../../storage/EmbedData";
import response from "../../components/response/response";
import dbAccess from "../../database/dbAccess";
import logError from "../../components/logError";
import config from "../../../config";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.about;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "about",
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
      const language = selectLanguage(lang);
      const embed = await StatusEmbedBuilder(client, language, interaction);
      const embeds = [EmbedBuilder.from(embed!)];

      const components = [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setEmoji(EmbedData.emotes.default.update)
              .setCustomId("botUpdates")
              .setLabel(language.replies.buttons.update)
              .setStyle(ButtonStyle.Primary)
          )
      ];

      return await response(interaction, {
        embeds,
        components
      });
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