const
  {
    EmbedBuilder
  } = require("discord.js"),
  error = require("../../functions/error"),
  statusEmbedBuilder = require("../../functions/statusEmbedBuilder");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").ButtonInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isButton()) return;

    if (interaction.customId === "refreshStatus") {
      await interaction.deferUpdate({ withResponse: true });
      return await interaction.editReply({
        embeds: [EmbedBuilder.from(await statusEmbedBuilder(client))]
      });
    };
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