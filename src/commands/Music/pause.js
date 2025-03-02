
const
  {
    ApplicationCommandType,
    PermissionFlagsBits,
    ApplicationCommandOptionType,
    PermissionsBitField
  } = require("discord.js"),
  radio = require("../../functions/player"),
  response = require("../../functions/response"),
  selectLanguage = require("../../functions/selectLanguage"),
  config = require("../../../config"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.pause,
  database = require("../../functions/database"),
  checkPlayerPerms = require("../../functions/checkPlayerPerms");

module.exports = {
  data: {
    name: "pause",
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
  aliases: ["pe"],
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
      language = selectLanguage(lang).commands.pause;

    // Check perms
    if (await checkPlayerPerms(interaction))
      return;

    // Pause Player
    const queue = new radio(interaction);
    queue.pause();

    return await response(interaction, {
      content: language.replies.paused
    });
  },
};
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */