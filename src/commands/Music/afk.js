const
  {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ChannelType,
    PermissionFlagsBits,
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
  } = require("discord.js"),
  response = require("../../functions/response"),
  radio = require("../../functions/player"),
  sendError = require("../../functions/sendError"),
  selectLanguage = require("../../functions/selectLanguage"),
  config = require("../../../config"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  replaceValues = require("../../functions/replaceValues"),
  database = require("../../functions/database"),
  defaultLanguage = selectLanguage(config.source.default_language).commands.afk,
  embed = require("../../storage/embed"),
  deleteResponse = require("../../functions/deleteResponse");

module.exports = {
  data: {
    name: "afk",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ManageGuild
    ]),
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
        name: "channel",
        description: defaultLanguage.options.channel,
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildVoice],
        required: false
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
  usage: "[channel | id]",
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
        afk: `radioAFK.${interaction.guildId}`,
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).commands.afk,
      memberChannelId = interaction.member?.voice?.channelId,
      queue = new radio(),
      afk = client.commands.get("afk");

    let channel = interaction.user ? interaction.options.getChannel("channel") : interaction.mentions.channels.first() || interaction.guild.channels.cache.get(args[0]);
    if (!channel && memberChannelId)
      channel = interaction.member?.voice?.channel;

    if (!channel && await db.has(databaseNames.afk)) {
      const afkChannel = await db.get(databaseNames.afk);
      const message = await sendError({
        interaction,
        isUpdateNeed: true,
        data: {
          embeds: [
            new EmbedBuilder()
              .setColor(embed.color.red)
              .setFooter(
                {
                  text: embed.footer.footerText,
                  iconURL: embed.footer.footerIcon
                }
              )
              .setTitle(selectLanguage(lang).replies.error)
              .setDescription(`${replaceValues(language.replies.doDeleteChannel, {
                channel: afkChannel
              })}`)
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId("afk-accept")
                  .setEmoji("✅")
                  .setLabel(selectLanguage(lang).replies.buttons.buttonYes)
                  .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                  .setCustomId("afk-cancel")
                  .setEmoji("❌")
                  .setLabel(selectLanguage(lang).replies.buttons.buttonNo)
                  .setStyle(ButtonStyle.Secondary)
              )
          ]
        }
      });
      const collector = await message.createMessageComponentCollector({
        time: 60 * 1000,
        componentType: ComponentType.Button
      });
      collector.on("collect", async (button) => {
        if (button.user.id !== interaction.member.id)
          return await sendError({
            interaction: button,
            log: replaceValues(selectLanguage(lang).commands.help.replies.invalidUser, {
              mention_command: `</${afk.data.name}:${afk.data?.id}>`,
              author: interaction.member
            })
          });

        switch (button.customId) {
          case "afk-accept": {
            await button.deferUpdate();
            await db.delete(databaseNames.afk);
            return await button.editReply({
              content: language.replies.deleteChannel,
              embeds: [],
              components: []
            });
          };
          case "afk-cancel": {
            collector.stop();
          };
        }
      });
      collector.on("end", async () => {
        return await deleteResponse({ interaction, message: message });
      });

      return;
    }

    if (!channel && !memberChannelId)
      return await sendError({
        interaction,
        isUpdateNeed: true,
        log: language.replies.noChannelError
      });

    if (!queue.isConnected(interaction.guildId))
      return await sendError({
        interaction,
        isUpdateNeed: true,
        log: language.replies.noPlayerError
      });

    await db.set(databaseNames.afk, channel.id);
    return await response(interaction, {
      content: replaceValues(language.replies.success, {
        channel
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