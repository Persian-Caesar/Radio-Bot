const error = require("./error");

/**
 *
 * @param {import("discord.js").CommandInteraction} interaction
 * @param {import("discord.js").BaseMessageOptions} data
 * @returns {import("discord.js").Message}
 */
module.exports = async function (interaction, data) {
  try {
    if (interaction.user) return await interaction.editReply(data);

    else return await interaction.reply(data);
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