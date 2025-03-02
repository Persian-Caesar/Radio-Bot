const
  {
    ButtonBuilder,
    ActionRowBuilder
  } = require("discord.js"),
  error = require("./error");

/**
 *
 * @param {import("discord.js").ButtonInteraction} interaction
 * @param {{ id: string, emote: string, lable: string, url: string, style: import("discord.js").ButtonStyle, disabled: boolean }} data
 * @returns {Array<import("discord.js").ActionRow<import("discord.js").ButtonBuilder>>}
 */
module.exports = async function (interaction, data = { id, emote, lable, url, style, disabled }) {
  try {
    const components = interaction.message.components.map(oldActionRow => {
      const updatedActionRow = new ActionRowBuilder()
        .addComponents(
          oldActionRow.components.map(buttonComponent => {
            const newButton = ButtonBuilder.from(buttonComponent)
            if (interaction.component.customId == buttonComponent.customId) {
              if (data.id)
                newButton.setCustomId(data.id)

              if (data.disabled)
                newButton.setDisabled(data.disabled)

              if (data.style)
                newButton.setStyle(data.style)

              if (data.url)
                newButton.setURL(data.url)

              if (data.lable)
                newButton.setLabel(data.lable)

              if (data.emote)
                newButton.setEmoji(data.emote)
            };

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