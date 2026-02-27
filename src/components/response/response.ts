import {
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  MessageReplyOptions
} from "discord.js";
import { Respondable } from "../../types/bot/discord";
import repeatAction from "../repeatAction";
import logError from "../logError";

export default async function response(
  interaction: Respondable,
  data: InteractionReplyOptions | InteractionEditReplyOptions | MessageReplyOptions
) {
  try {
    if ("editReply" in interaction)
      if (interaction.deferred)
        return await repeatAction(async () => await interaction.editReply(data as InteractionEditReplyOptions));

      else {
        await repeatAction(async () => await interaction.reply(data as InteractionReplyOptions));
        return await interaction.fetchReply();
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