import {
  ButtonInteraction,
  EmbedBuilder,
  MessageFlags
} from "discord.js";
import {
  ErrorCode,
  ErrorDetails
} from "../../types/bot/handle-error";
import StatusEmbedBuilder from "../../components/StatusEmbedBuilder";
import selectLanguage from "../../components/selectLanguage";
import DiscordClient from "../../model/Client";
import responseError from "../../components/response/responseError";
import responseEdit from "../../components/response/responseEdit";
import EmbedData from "../../storage/EmbedData";
import response from "../../components/response/response";
import dbAccess from "../../database/dbAccess";
import logError from "../../components/logError";
import config from "../../../config";

export default async (client: DiscordClient, interaction: ButtonInteraction) => {
  try {
    if (!interaction.isButton()) return;

    const guildId = interaction.guildId!;
    const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
    const language = selectLanguage(lang).replies;

    if (interaction.customId === "botUpdates")
      return await response(interaction, {
        flags: MessageFlags.Ephemeral,
        embeds: [
          new EmbedBuilder()
            .setTitle(`${EmbedData.emotes.default.update}| Bot New Updates`)
            .setDescription(EmbedData.update)
            .setColor(EmbedData.color.theme.HexToNumber())
        ]
      });

    if (interaction.customId === "refreshStatus") {
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang);
      const embed = await StatusEmbedBuilder(client, language, interaction);

      await interaction.deferUpdate({ withResponse: true });

      await responseEdit(interaction, {
        embeds: [
          EmbedBuilder.from(embed!)
        ]
      });

      return;
    };

    if (interaction.customId.startsWith("owner")) {
      if (!config.discord.support.owners.includes(interaction.user.id))
        return await responseError(
          interaction,
          language.onlyOwner,
          undefined,
          {
            name: "OWNER_ONLY_COMMAND",
            code: ErrorCode.OWNER_ONLY_COMMAND,
            message: ErrorDetails[ErrorCode.OWNER_ONLY_COMMAND]
          }
        );
    }

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