const
  {
    PermissionFlagsBits,
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
  } = require("discord.js"),
  error = require("../../functions/error"),
  sendError = require("../../functions/sendError"),
  copyRight = require("../../storage/embed"),
  deleteResponse = require("../../functions/deleteResponse"),
  editResponse = require("../../functions/editResponse"),
  response = require("../../functions/response"),
  createORgetInvite = require("../../functions/createORgetInvite"),
  selectLanguage = require("../../functions/selectLanguage"),
  replaceValues = require("../../functions/replaceValues"),
  config = require("../../../config"),
  language = selectLanguage(config.source.default_language).commands.guilds;

module.exports = {
  data: {
    name: "guilds",
    description: language.description,
    default_member_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
    default_bot_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
    dm_permission: true,
    nsfw: false
  },
  category: "owner",
  cooldown: 5,
  aliases: ["gu"],
  usage: "[id]",
  only_owner: true,
  only_slash: false,
  only_message: true,

  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @returns {void}
   */
  run: async (client, message, args) => {
    try {
      let
        page = 1,
        currentIndex = 0;

      const
        guildId = args[0],
        timeout = 2 * 60 * 1000,
        backId = "ownerGuildsEmbedBack",
        forwardId = "ownerGuildsEmbedForward",
        backButton = new ButtonBuilder({
          style: ButtonStyle.Secondary,
          emoji: copyRight.emotes.default.arrow_left,
          customId: backId
        }),

        forwardButton = new ButtonBuilder({
          style: ButtonStyle.Secondary,
          emoji: copyRight.emotes.default.arrow_right,
          customId: forwardId
        }),

        guilds = [...client.guilds.cache.values()];


      if (guildId) {
        const guild = client.guilds.cache.get(guildId);
        if (!guild || !guild.id)
          return await sendError({
            interaction: message,
            log: language.replies.cantFindGuilds
          });

        const
          invite = await createORgetInvite(guild),
          guildOwner = await guild.fetchOwner(),
          joinedAt = (await guild.members.fetchMe({ cache: true })).joinedAt,
          embed = new EmbedBuilder()
            .setThumbnail(guild.iconURL({ forceStatic: true }))
            .setColor(copyRight.color.theme)
            .setTimestamp()
            .setAuthor(
              {
                name: guildOwner.user.tag,
                iconURL: guildOwner.user.displayAvatarURL({ forceStatic: true })
              }
            )
            .setTitle(`${guild.name}`)
            .setFields(
              [
                {
                  name: language.replies.embed.guild,
                  value: `${guild.name} (${guild.id}) | \`${guild.memberCount.toLocaleString()}\` Members`
                },
                {
                  name: language.replies.embed.owner,
                  value: `${guildOwner} (${guildOwner.id})`
                },
                {
                  name: language.replies.embed.date,
                  value: replaceValues(language.replies.embed.dateValue, {
                    createdAt: `<t:${Date.parse(guild.createdAt) / 1000}:D>(<t:${Date.parse(guild.createdAt) / 1000}:R>)`,
                    joinedAt: `<t:${Date.parse(joinedAt) / 1000}:D>(<t:${Date.parse(joinedAt) / 1000}:R>)`
                  })
                }
              ]
            )

        if (guild.banner)
          embed.setImage(guild.bannerURL({ forceStatic: true }));

        if (invite && invite.url)
          embed.setURL(invite.url);

        return await response(message, {
          embeds: [embed],
          components: invite && invite.url ? [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setEmoji(copyRight.emotes.default.server)
                  .setLabel(
                    replaceValues(language.replies.joinButton, {
                      guild: guild.name
                    })
                  )
                  .setURL(invite.url)
                  .setStyle(ButtonStyle.Link)
              )
          ] : []
        });
      }

      const
        generateEmbed = async start => {
          const
            current = guilds.sort((a, b) => b.memberCount - a.memberCount).slice(start, start + 12),
            embed = new EmbedBuilder({
              title: `${language.replies.embed.page} - ${page}/${Math.ceil(client.guilds.cache.size / 12)} | ${language.replies.embed.allGuilds} ${(guilds.length).toLocaleString()}`,
              fields: await Promise.all(
                current
                  .sort((a, b) => b.memberCount - a.memberCount)
                  .map(async guild =>
                  (
                    {
                      name: `${guild.name} (${guild.id}) | \`${(guild.memberCount).toLocaleString()}\` ${language.replies.embed.members}`,
                      value: `**${language.replies.embed.owner} \`${(await guild.fetchOwner()).user.tag}\`(\`${guild.ownerId}\`)\n${language.replies.embed.date} ${replaceValues(language.replies.embed.dateValue, {
                        createdAt: `<t:${Date.parse(guild.createdAt) / 1000}:D>(<t:${Date.parse(guild.createdAt) / 1000}:R>)`,
                        joinedAt: `<t:${Date.parse((await guild.members.fetchMe({ cache: true })).joinedAt) / 1000}:D>(<t:${Date.parse((await guild.members.fetchMe({ cache: true })).joinedAt) / 1000}:R>)`
                      })}**`
                    }
                  )
                  )
              )
            })
          return embed.setColor(copyRight.color.theme)
        },
        canFitOnOnePage = guilds.length <= 12,
        msg = await response(message, {
          embeds: [await generateEmbed(0)],
          components: canFitOnOnePage ? [] : [new ActionRowBuilder({ components: [forwardButton] })]
        });

      if (canFitOnOnePage)
        return;

      const collector = msg.createMessageComponentCollector({
        time: timeout
      });

      collector.on("collect", async interaction => {
        if (interaction.customId === backId) {
          currentIndex -= 12;
          page -= 1;
        } else {
          page += 1;
          currentIndex += 12;
        }

        await interaction.deferUpdate({ fetchReply: true });
        return await interaction.editReply(
          {
            embeds: [await generateEmbed(currentIndex)],
            components: [new ActionRowBuilder({ components: [...(currentIndex ? [backButton] : []), ...(currentIndex + 12 < guilds.length ? [forwardButton] : [])] })]
          }
        );
      });
      collector.on("end", async () => {
        return await deleteResponse({
          interaction: message,
          message: msg
        })
      });
    } catch (e) {
      error(e)
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