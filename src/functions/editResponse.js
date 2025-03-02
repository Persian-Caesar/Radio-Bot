const error = require("./error");

/**
 *
 * @param {{interaction: import("discord.js").CommandInteraction, message: import("discord.js").Message, data: import("discord.js").BaseMessageOptions }} param0
 * @returns {import("discord.js").Message}
 */
module.exports = async function ({ interaction, message = null, data }) {
  try {
    if (interaction.user)
      return await interaction.editReply(data).catch(e => e);

    else
      return await message.edit(data).catch(e => e);
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