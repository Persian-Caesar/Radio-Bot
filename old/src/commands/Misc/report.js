const
  {
    ApplicationCommandType,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    PermissionsBitField
  } = require("discord.js"),
  response = require("../../functions/response"),
  config = require("../../../config"),
  embed = require("../../storage/embed"),
  selectLanguage = require("../../functions/selectLanguage"),
  database = require("../../functions/database"),
  defaultLanguage = selectLanguage(config.source.default_language).commands.report;

module.exports = {
  data: {
    name: "report",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
    default_bot_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks
    ]),
    dm_permission: true,
    nsfw: false
  },
  category: "misc",
  cooldown: 5,
  only_owner: false,
  only_slash: true,
  only_message: true,

  /**
   * 
   * @param {import("discord.js").Client} client 
   * @param {import("discord.js").CommandInteraction} interaction 
   * @param {Array} args 
   * @returns {void}
   */
  run: async (client, interaction, args) => {
    const
      db = new database(client.db),
      databaseNames = {
        language: `language.${interaction.guildId}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang);

    if (interaction.user) {
      const modal = new ModalBuilder()
        .setTitle(language.replies.modals.reportModalTitle)
        .setCustomId("reportModal")
        .addComponents(
          new ActionRowBuilder()
            .addComponents(
              new TextInputBuilder()
                .setCustomId("reportModalMessage")
                .setLabel(language.replies.modals.reportModalLabel)
                .setPlaceholder(language.replies.modals.reportModalPlaceholder)
                .setStyle(TextInputStyle.Paragraph)
            )
        );

      return await interaction.showModal(modal);
    }
    else {
      return await response(interaction, {
        content: " ",
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(embed.emotes.default.report)
                .setLabel(language.commands.report.replies.reportButton)
                .setCustomId("reportButton")
            )
        ]
      })
    }
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