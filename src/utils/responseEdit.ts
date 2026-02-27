import {
  AnySelectMenuInteraction,
  CommandInteraction,
  InteractionEditReplyOptions
} from "discord.js";
import repeatAction from "./repeatAction";
import error from "./error";

export default async function (
  interaction: CommandInteraction | AnySelectMenuInteraction,
  data: InteractionEditReplyOptions | null
) {
  try {
    return await repeatAction(async () => await interaction.editReply(data as InteractionEditReplyOptions));
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