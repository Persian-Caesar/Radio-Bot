import {
  ActionRowBuilder,
  APIEmbedField,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  PermissionsBitField
} from "discord.js";
import { CommandType } from "../../types/interfaces";
import responseDelete from "../../utils/responseDelete";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/responseError";
import responseEdit from "../../utils/responseEdit";
import GetInvite from "../../utils/GetInvite";
import EmbedData from "../../storage/EmbedData";
import response from "../../utils/response";
import config from "../../../config";
import error from "../../utils/error";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.guilds;

export default {
  data: {
    name: "guilds",
    description: defaultLanguage.description,
    default_member_permissions: new PermissionsBitField([
      "SendMessages"
    ]),
    default_bot_permissions: new PermissionsBitField([
      "SendMessages"
    ]),
    dm_permission: true
  },
  category: "owner",
  cooldown: 5,
  aliases: ["gu"],
  usage: "[id]",
  only_slash: false,
  only_owner: true,
  only_message: true,

  run: async (client, message: Message, args) => {
    try {
      let
        page = 1,
        currentIndex = 0;

      const
        guildId = args![0],
        timeout = 2 * 60 * 1000,
        backId = "ownerGuildsEmbedBack",
        forwardId = "ownerGuildsEmbedForward",
        backButton = new ButtonBuilder({
          style: ButtonStyle.Secondary,
          emoji: EmbedData.emotes.default.arrow_left,
          custom_id: backId
        }),

        forwardButton = new ButtonBuilder({
          style: ButtonStyle.Secondary,
          emoji: EmbedData.emotes.default.arrow_right,
          custom_id: forwardId
        }),

        guilds = [...client.guilds.cache.values()];


      if (guildId) {
        const guild = client.guilds.cache.get(guildId);
        if (!guild || !guild.id)
          return await responseError(
            message,
            "این آیدی یافت نشد."
          );

        const
          guildCreatedDate = Date.parse(guild.createdAt.toString()) / 1000,
          joinedAt = Date.parse(
            (await guild.members.fetchMe({ cache: true })).joinedAt!.toString()
          ) / 1000,
          invite = (await GetInvite(guild))!,
          guildOwner = await guild.fetchOwner(),
          embed = new EmbedBuilder()
            .setThumbnail(guild.iconURL({ forceStatic: true }))
            .setColor(EmbedData.color.theme.HexToNumber())
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
                  name: "Guild:",
                  value: `${guild.name} (${guild.id}) | \`${guild.memberCount.toLocaleString()}\` Members`
                },
                {
                  name: "Owner:",
                  value: `${guildOwner} (${guildOwner.id})`
                },
                {
                  name: "Dates:",
                  value: `Created at <t:${guildCreatedDate}:D>(<t:${guildCreatedDate}:R>) | Joinned at <t:${joinedAt}:D>(<t:${joinedAt}:R>)`
                }
              ]
            )

        if (guild.banner)
          embed.setImage(guild.bannerURL({ forceStatic: true }));

        if (invite && invite.url)
          embed.setURL(invite.url);

        return await response(message, {
          embeds: [embed],
          components: [
            new ActionRowBuilder<ButtonBuilder>()
              .addComponents(
                new ButtonBuilder()
                  .setEmoji(EmbedData.emotes.default.server)
                  .setLabel(`جوین شدن به ${guild.name}`)
                  .setURL(invite.url)
                  .setStyle(ButtonStyle.Link)
              )
          ]
        });
      }

      const
        generateEmbed = async (start: number) => {
          const current = guilds.sort((a, b) => b.memberCount - a.memberCount).slice(start, start + 12);
          current.sort((a, b) => b.memberCount - a.memberCount);

          const fields: Promise<APIEmbedField[]> = Promise.all(
            current.map(async guild => {
              const
                guildCreatedAt = Date.parse(guild.createdAt.toString()) / 1000,
                joinedAt = Date.parse((await guild.members.fetchMe({ cache: true })).joinedAt!.toString()) / 1000;

              return {
                name: `${guild.name} (${guild.id}) | \`${(guild.memberCount).toLocaleString()}\` Members`,
                value: `**Owner: \`${(await guild.fetchOwner()).user.tag}\`(\`${guild.ownerId}\`)\nDates: Created at <t:${guildCreatedAt}:D>(<t:${guildCreatedAt}:R>) | Joinned at <t:${joinedAt}:D>(<t:${joinedAt}:R>)**`
              }
            })
          );

          return new EmbedBuilder()
            .setTitle(`Page - ${page}/${Math.ceil(client.guilds.cache.size / 12)} | All Guilds: ${(guilds.length).toLocaleString()}`)
            .setFields(await fields)
            .setColor(EmbedData.color.theme.HexToNumber());
        },
        canFitOnOnePage = guilds.length <= 12,
        msg = (await response(message, {
          embeds: [await generateEmbed(0)],
          components: canFitOnOnePage ?
            [] : [
              new ActionRowBuilder<ButtonBuilder>().setComponents(forwardButton)
            ]
        }))!;

      if (canFitOnOnePage)
        return;

      const collector = msg.createMessageComponentCollector({
        time: timeout
      });

      collector.on("collect", async interaction => {
        interaction.customId === backId ? (currentIndex -= 12) : (currentIndex += 12)
        interaction.customId === backId ? (page -= 1) : (page += 1)
        return await responseEdit(
          message,
          {
            embeds: [await generateEmbed(currentIndex)],
            components: [
              new ActionRowBuilder<ButtonBuilder>()
                .setComponents(
                  [...(currentIndex ? [backButton] : []), ...(currentIndex + 12 < guilds.length ? [forwardButton] : [])]
                )
            ]
          },
          msg
        )
      })
      collector.on("end", async () => {
        return responseDelete(
          message,
          msg
        )
      });
    }

    catch (e) {
      error(e)
    }
  }
} as CommandType;

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */