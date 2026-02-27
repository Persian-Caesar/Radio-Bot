import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  APIEmbedField,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
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
import logError from "../../utils/logError";
import config from "../../../config";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.guilds;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

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
    dm_permission: true,
    options: [
      {
        name: "guild",
        description: defaultLanguage.options.guild,
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
        required: true
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
  category: "owner",
  cooldown: 5,
  usage: "[id]",
  only_owner: true,

  run: async (client, interaction) => {
    try {
      let
        page = 1,
        currentIndex = 0;

      const language = defaultLanguage.replies;

      const guildId = interaction.options.getString("guild", true);

      const timeout = 2 * 60 * 1000;
      const backId = "ownerGuildsEmbedBack";
      const forwardId = "ownerGuildsEmbedForward";
      const backButton = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        emoji: EmbedData.emotes.default.arrow_left,
        custom_id: backId
      });

      const forwardButton = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        emoji: EmbedData.emotes.default.arrow_right,
        custom_id: forwardId
      });

      const guilds = [...client.guilds.cache.values()];

      if (guildId) {
        const guild = client.guilds.cache.get(guildId);
        if (!guild || !guild.id)
          return await responseError(
            interaction,
            language.cantFindGuilds
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
                  name: language.embed.guild,
                  value: `${guild.name} (${guild.id}) | \`${guild.memberCount.toLocaleString()}\` ${language.embed.members}`
                },
                {
                  name: language.embed.owner,
                  value: `${guildOwner} (${guildOwner.id})`
                },
                {
                  name: language.embed.date,
                  value:
                    language.embed.dateValue
                      .replaceValues({
                        createdAt: `<t:${guildCreatedDate}:D>(<t:${guildCreatedDate}:R>)`,
                        joinedAt: `<t:${joinedAt}:D>(<t:${joinedAt}:R>)`
                      })
                }
              ]
            )

        if (guild.banner)
          embed.setImage(guild.bannerURL({ forceStatic: true }));

        if (invite && invite.url)
          embed.setURL(invite.url);

        return await response(interaction, {
          embeds: [embed],
          components: [
            new ActionRowBuilder<ButtonBuilder>()
              .addComponents(
                new ButtonBuilder()
                  .setEmoji(EmbedData.emotes.default.server)
                  .setLabel(language.joinButton.replace("{guild}", guild.name))
                  .setURL(invite.url)
                  .setStyle(ButtonStyle.Link)
              )
          ]
        });
      }

      const generateEmbed = async (start: number) => {
        const current = guilds.sort((a, b) => b.memberCount - a.memberCount).slice(start, start + 12);
        current.sort((a, b) => b.memberCount - a.memberCount);

        const fields: Promise<APIEmbedField[]> = Promise.all(
          current.map(async guild => {
            const
              guildCreatedAt = Date.parse(guild.createdAt.toString()) / 1000,
              joinedAt = Date.parse((await guild.members.fetchMe({ cache: true })).joinedAt!.toString()) / 1000;

            return {
              name: `${guild.name} (${guild.id}) | \`${(guild.memberCount).toLocaleString()}\` ${language.embed.members}`,
              value: `**${language.embed.owner} \`${(await guild.fetchOwner()).user.tag}\`(\`${guild.ownerId}\`)\n${language.embed.date} ${language.embed.dateValue.replaceValues({
                createdAt: `<t:${guildCreatedAt}:D>(<t:${guildCreatedAt}:R>)`,
                joinedAt: `<t:${joinedAt}:D>(<t:${joinedAt}:R>)`
              })}**`
            }
          })
        );

        return new EmbedBuilder()
          .setTitle(`${language.embed.page} - ${page}/${Math.ceil(client.guilds.cache.size / 12)} | ${language.embed.allGuilds} ${(guilds.length).toLocaleString()}`)
          .setFields(await fields)
          .setColor(EmbedData.color.theme.HexToNumber());
      };

      const canFitOnOnePage = guilds.length <= 12;
      const msg = (await response(interaction, {
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

      collector.on("collect", async collected => {
        collected.customId === backId ? (currentIndex -= 12) : (currentIndex += 12)
        collected.customId === backId ? (page -= 1) : (page += 1)

        return await responseEdit(
          collected as AnySelectMenuInteraction,
          {
            embeds: [await generateEmbed(currentIndex)],
            components: [
              new ActionRowBuilder<ButtonBuilder>()
                .setComponents(
                  [...(currentIndex ? [backButton] : []), ...(currentIndex + 12 < guilds.length ? [forwardButton] : [])]
                )
            ]
          }
        )
      })
      collector.on("end", async () => {
        return responseDelete(
          interaction
        )
      });
    }

    catch (e) {
      logError(e)
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