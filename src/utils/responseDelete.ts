import { Respondable } from "../types/types";
import repeatAction from "./repeatAction";
import logError from "./logError";

export default async function responseDelete(
  interaction: Respondable
) {
  try {
    if ("deleteReply" in interaction)
      return await repeatAction(async () => await interaction.deleteReply().catch(e => e));

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