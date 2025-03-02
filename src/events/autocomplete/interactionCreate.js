const
  error = require("../../functions/error"),
  radiostation = require("../../storage/radiostation.json"),
  languages = require("../../storage/languages.json"),
  choices = Object.keys(radiostation)
    .map((a) => JSON.stringify({
      name: `${a}`,
      value: `${a}`
    }))
    .map(a => JSON.parse(a));

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").AutocompleteInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isAutocomplete()) return;

    switch (interaction.commandName) {
      case "play": {
        const focusedValue = interaction.options.getFocused();
        const firstChoice = choices.filter(a => a.name.toLowerCase().startsWith(focusedValue.toLowerCase()));
        return await interaction.respond(firstChoice.slice(0, 25)).catch(a => a);
        break;
      }
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