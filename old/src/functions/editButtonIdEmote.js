const
  {
    ButtonBuilder,
    ActionRowBuilder
  } = require("discord.js"),
  error = require("./error");

/**
 *
 * @param {import("discord.js").ButtonInteraction} interaction
 * @param {string} id
 * @param {string} emote
 * @returns {Array<import("discord.js").ActionRow<import("discord.js").ButtonBuilder>>}
 */
module.exports = async function (interaction, id, emote) {
  try {
    const components = interaction.message.components.map(oldActionRow => {
      const updatedActionRow = new ActionRowBuilder()
        .addComponents(
          oldActionRow.components.map(buttonComponent => {
            const newButton = ButtonBuilder.from(buttonComponent)
            if (interaction.component.customId == buttonComponent.customId)
              newButton.setCustomId(id).setEmoji(emote);

            return newButton;
          })
        )
      return updatedActionRow;
    });
    return components;
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
