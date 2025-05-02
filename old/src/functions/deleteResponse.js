const error = require("./error");

/**
 *
 * @param {{interaction: import("discord.js").CommandInteraction, message: import("discord.js").Message }} param0
 * @returns {void}
 */
module.exports = async function ({ interaction, message = null }) {
  try {
    if (interaction.user)
      return await interaction.deleteReply().catch(e => e);

    else
      if (message.deletable && interaction.deletable) {
        await interaction.delete().catch(e => e);
        return await message.delete().catch(e => e);
      }

  } catch (e) {
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