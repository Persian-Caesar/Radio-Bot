const { MessageFlags } = require("discord.js");
const
  error = require("../../functions/error"),
  player = require("../../functions/player"),
  radiostation = require("../../storage/radiostation.json"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  checkPlayerPerms = require("../../functions/checkPlayerPerms"),
  database = require("../../functions/database"),
  replaceValues = require("../../functions/replaceValues");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId.startsWith("radioPanel")) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral, withResponse: true });
      const
        choice = interaction.values[0],
        db = new database(client.db),
        databaseNames = {
          station: `radioStation.${interaction.guildId}`,
          language: `language.${interaction.guildId}`
        },
        lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
        language = selectLanguage(lang);

      // Check perms
      if (await checkPlayerPerms(interaction))
        return;

      // Start to play station
      const radio = new player(interaction);
      await db.set(databaseNames.station, choice);
      await radio.radio(radiostation[choice]);
      return await interaction.editReply({
        content: replaceValues(language.commands.play.replies.play, {
          song: choice
        })
      })
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