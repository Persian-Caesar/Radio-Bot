const
  { EmbedBuilder, MessageFlags } = require("discord.js"),
  embed = require("../../storage/embed"),
  error = require("../../functions/error"),
  database = require("../../functions/database"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  sendError = require("../../functions/sendError");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").ButtonInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isButton()) return;

    const
      db = new database(client.db),
      databaseNames = {
        language: `language.${interaction.guildId}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies;

    if (interaction.customId === "botUpdates")
      return await interaction.reply({
        flags: MessageFlags.Ephemeral,
        embeds: [
          new EmbedBuilder()
            .setTitle(`${embed.emotes.default.update}| Bot New Updates`)
            .setDescription(embed.update)
            .setColor(embed.color.theme)
        ]
      });

    if (interaction.customId.startsWith("owner"))
      if (!config.discord.support.owners.includes(interaction.user.id))
        return await sendError({
          interaction,
          log: language.onlyOwner
        });

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