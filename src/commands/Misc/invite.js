const
  {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
  } = require("discord.js"),
  response = require("../../functions/response"),
  config = require("../../../config"),
  data = require("../../storage/embed"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.invite,
  database = require("../../functions/database"),
  replaceValues = require("../../functions/replaceValues");

module.exports = {
  data: {
    name: "invite",
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
      language = selectLanguage(lang).commands.invite,
      embeds = [
        new EmbedBuilder()
          .setColor(data.color.theme)
          .setTitle(
            replaceValues(language.replies.embedTitle, {
              username: client.user.displayName
            })
          )
          .setDescription(language.replies.embedDescription)
          .addFields(
            {
              name: language.replies.fields.suggest + ":",
              value: replaceValues(language.replies.values.suggest, {
                username: client.user.displayName,
                link: config.discord.default_invite.replace("{clientId}", client.user.id)
              }),
              inline: true
            },
            {
              name: language.replies.fields.noRole + ":",
              value: replaceValues(language.replies.values.noRole, {
                link: config.discord.noperms_invite.replace("{clientId}", client.user.id)
              }),
              inline: true
            },
            {
              name: replaceValues(language.replies.fields.links, { username: client.user.displayName }),
              value: `[Top.gg](https://top.gg/bot/${client.user.id}) • [Discord.Bots.gg](https://discord.bots.gg/bots/${client.user.id}) • [Discords.com](https://discords.com/bots/bot/${client.user.id}) • [DiscordBotList.com](${config.discord.discordbotlist}) • [DiscordList.gg](https://discordlist.gg/bot/${client.user.id})`,
              inline: false
            }
          )
          .setFooter(
            {
              text: language.replies.embedFooter
            }
          )
          .setTimestamp()
      ],

      components = [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setEmoji(data.emotes.default.invite)
              .setLabel(language.replies.fields.suggest)
              .setURL(config.discord.default_invite.replace("{clientId}", client.user.id))
              .setStyle(ButtonStyle.Link),

            new ButtonBuilder()
              .setEmoji(data.emotes.default.close)
              .setLabel(language.replies.fields.noRole)
              .setURL(config.discord.noperms_invite.replace("{clientId}", client.user.id))
              .setStyle(ButtonStyle.Link)
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