const
  {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField
  } = require("discord.js"),
  radio = require("../../functions/player"),
  data = require("../../storage/embed"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  replaceValues = require("../../functions/replaceValues"),
  defaultLanguage = selectLanguage(config.source.default_language).commands.volume,
  response = require("../../functions/response"),
  checkPlayerPerms = require("../../functions/checkPlayerPerms"),
  database = require("../../functions/database"),
  sendError = require("../../functions/sendError");

module.exports = {
  data: {
    name: "volume",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
    default_bot_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.Connect,
      PermissionFlagsBits.Speak
    ]),
    dm_permission: false,
    nsfw: false,
    options: [
      {
        name: "input",
        description: defaultLanguage.options.input,
        type: ApplicationCommandOptionType.Number,
        required: false,
        min_value: 1,
        max_value: 200
      },
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
  category: "music",
  cooldown: 5,
  aliases: ["vol"],
  only_owner: false,
  only_slash: true,
  only_message: true,

  /**
   * 
   * @param {import("discord.js").Client} client 
   * @param {import("discord.js").CommandInteraction} interaction 
   * @param {Array<string>} args 
   * @returns {void}
   */
  run: async (client, interaction, args) => {
    const
      db = new database(client.db),
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).commands.volume;

    // Check perms
    if (await checkPlayerPerms(interaction))
      return;

    // Stop The Player
    const queue = new radio(interaction);
    const input = interaction.user ? interaction.options.getNumber("input") : args[0];
    if (!queue.isConnection(interaction.guildId))
      return await sendError(
        {
          interaction,
          isUpdateNeed: true,
          log: selectLanguage(lang).replies.noConnection
        }
      )

    if (!input) {
      const embed = new EmbedBuilder()
        .setColor(data.color.theme)
        .setDescription(
          replaceValues(language.replies.currentVolume, {
            volume: queue.volume
          })
        )
        .setFooter(
          {
            text: language.replies.footer
          }
        );

      return await response(interaction, {
        ephemeral: true,
        embeds: [embed]
      });
    }

    if (Number(input) < 0 || Number(input) > 200)
      return await sendError({
        interaction,
        isUpdateNeed: true,
        log: language.replies.invalidInput
      });

    const volume = queue.setVolume(Number(input));
    return await response(interaction, {
      content: replaceValues(language.replies.success, {
        volume
      })
    });
  }
};
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */