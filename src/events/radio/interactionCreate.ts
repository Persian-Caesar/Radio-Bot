import {
  MessageFlags,
  StringSelectMenuInteraction
} from "discord.js";
import checkPlayerPerms from "../../components/permission/checkPlayerPerms";
import selectLanguage from "../../components/selectLanguage";
import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import PlayerManager from "../../model/PlayerManager";
import dbAccess from "../../database/dbAccess";
import logError from "../../components/logError";
import config from "../../../config";

export default async (client: DiscordClient, interaction: StringSelectMenuInteraction) => {
  try {
    if (!interaction.isStringSelectMenu()) return;

    const guildId = interaction.guildId!;
    const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
    const language = selectLanguage(lang);

    if (interaction.customId.startsWith("radioPanel")) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral, withResponse: true });
      const choice = interaction.values[0];

      // Check perms
      if (await checkPlayerPerms(interaction))
        return;

      // Start to play station
      let player = client.players!.get(guildId);

      if (!player) {
        player = new PlayerManager(interaction);
        client.players!.set(guildId, player);
      }

      await dbAccess.setStation(guildId, choice);

      await player.radio(radiostation[choice as "Persian Rap"]);

      await interaction.editReply({
        content: language.commands.play.replies.play.replaceValues({
          song: choice
        })
      })

      return;
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