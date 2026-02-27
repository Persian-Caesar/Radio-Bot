import {
  ButtonInteraction,
  EmbedBuilder
} from "discord.js";
import StatusEmbedBuilder from "../../utils/StatusEmbedBuilder";
import selectLanguage from "../../utils/selectLanguage";
import DiscordClient from "../../model/Client";
import logError from "../../utils/logError";
import config from "../../../config";

export default async (client: DiscordClient, interaction: ButtonInteraction) => {
  try {
    if (!interaction.isButton())
      return;

    if (interaction.customId === "refreshStatus") {
      await interaction.deferUpdate({ withResponse: true });
      const language = selectLanguage(config.discord.default_language);
      const embed = await StatusEmbedBuilder(client, language);

      await interaction.editReply({
        embeds: [
          EmbedBuilder.from(embed!)
        ]
      });

      return;
    };

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