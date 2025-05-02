const
  {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    PermissionsBitField
  } = require("discord.js"),
  response = require("../../functions/response"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.about,
  statusEmbedBuilder = require("../../functions/statusEmbedBuilder"),
  database = require("../../functions/database"),
  embed = require("../../storage/embed");

module.exports = {
  data: {
    name: "about",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
    default_bot_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks
    ]),
    dm_permission: true,
    nsfw: false,
    options: [
      {
        name: "ephemeral",
        description: ephemeral.description,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: ephemeral.choices.yes,
            value: "true"
          },
          {
            name: ephemeral.choices.no,
            value: "false"
          }
        ],
        required: false
      }
    ]
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
      language = selectLanguage(lang),
      embeds = [
        EmbedBuilder.from(await statusEmbedBuilder(client, language))
      ],

      components = [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setEmoji(embed.emotes.default.update)
              .setCustomId("botUpdates")
              .setLabel(language.replies.buttons.update)
              .setStyle(ButtonStyle.Primary)
          )
      ];

    return await response(interaction, {
      embeds,
      components
    });
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