const
  {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    PermissionsBitField,
    MessageFlags
  } = require("discord.js"),
  os = require("os"),
  response = require("../../functions/response"),
  error = require("../../functions/error"),
  editResponse = require("../../functions/editResponse"),
  config = require("../../../config"),
  embed = require("../../storage/embed"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  database = require("../../functions/database"),
  defaultLanguage = selectLanguage(config.source.default_language).commands.ping;

module.exports = {
  data: {
    name: "ping",
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
      language = selectLanguage(lang).commands.ping,
      embed1 = new EmbedBuilder()
        .setColor(embed.color.theme)
        .setDescription(language.replies.pinging),

      message = await response(interaction, { flags:MessageFlags.Ephemeral, embeds: [embed1] }).catch(error),

      embed2 = new EmbedBuilder()
        .setColor(embed.color.theme)
        .setThumbnail(client.user.displayAvatarURL({ forceStatic: true }))
        .setFooter({
          text: embed.footer.footerText,
          iconURL: embed.footer.footerIcon,
        })
        .setTitle(`${embed.emotes.default.ping} ${language.replies.ping}`)
        .setFields(
          [
            {
              name: `\u200b`,
              value: `**${embed.emotes.default.heartbeat}| ${language.replies.values.pinging} \`${Math.round(client.ws.ping)}\` ms**`,
              inline: true
            },
            {
              name: `\u200b`,
              value: `**${embed.emotes.default.timer}| ${language.replies.fields.time} \`${Date.now() - interaction.createdTimestamp}\` ms**`,
              inline: true
            },
            {
              name: `\u200b`,
              value: `**${embed.emotes.default.uptime}| ${language.replies.fields.uptime} <t:${Math.round(client.readyTimestamp / 1000)}:D> | <t:${Math.round(client.readyTimestamp / 1000)}:R>**`,
              inline: true
            },
            {
              name: `${embed.emotes.default.memory}| ${language.replies.fields.memory}`,
              value: `${embed.emotes.default.reply} **${Math.round(((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)).toLocaleString()}/${Math.round(((os.totalmem()) / 1024 / 1024).toFixed(2)).toLocaleString()} MB | \`${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%\`**`
            }
          ]
        )
        .setTimestamp();

    return await editResponse({ interaction, message, data: { embeds: [embed2] } });
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