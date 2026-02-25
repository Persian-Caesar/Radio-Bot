import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  LabelBuilder,
  ModalBuilder,
  PermissionsBitField,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { CommandType } from "../../types/interfaces";
import selectLanguage from "../../utils/selectLanguage";
import EmbedData from "../../storage/EmbedData";
import dbAccess from "../../database/dbAccess";
import response from "../../utils/response";
import config from "../../../config";
import error from "../../utils/error";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.report;

export default {
  data: {
    name: "report",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      "SendMessages",
    ]),
    default_bot_permissions: new PermissionsBitField([
      "SendMessages",
      "EmbedLinks"
    ]),
    dm_permission: true
  },
  category: "misc",
  cooldown: 10,

  run: async (client, interaction) => {
    try {
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang);

      const modal = new ModalBuilder()
        .setTitle(language.replies.modals.reportModalTitle)
        .setCustomId("reportModal");

      const modalLabel = new LabelBuilder()
        .setLabel(language.replies.modals.reportModalLabel)
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId("reportModalMessage")
            .setPlaceholder(language.replies.modals.reportModalPlaceholder)
            .setStyle(TextInputStyle.Paragraph)
        )

      modal.addLabelComponents(modalLabel)

      return await interaction.showModal(modal);
    }

    catch (e) {
      error(e)
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