import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField
} from "discord.js";
import { CommandType } from "../../types/interfaces";
import selectLanguage from "../../utils/selectLanguage";
import EmbedData from "../../storage/EmbedData";
import response from "../../utils/response";
import dbAccess from "../../database/dbAccess";
import config from "../../../config";
import error from "../../utils/error";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.invite;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "invite",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      "SendMessages",
    ]),
    default_bot_permissions: new PermissionsBitField([
      "SendMessages",
      "EmbedLinks"
    ]),
    dm_permission: true,
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
  aliases: ["h", "commands"],
  cooldown: 10,
  only_owner: false,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang).commands.invite;
      const embeds = [
        new EmbedBuilder()
          .setColor(EmbedData.color.theme.HexToNumber())
          .setTitle(
            language.replies.embedTitle.replaceValues({
              username: client.user!.displayName
            })
          )
          .setDescription(language.replies.embedDescription)
          .addFields(
            {
              name: language.replies.fields.suggest + ":",
              value: language.replies.values.suggest.replaceValues({
                username: client.user!.displayName,
                link: config.discord.default_invite.replace("{clientId}", client.user!.id)
              }),
              inline: true
            },
            {
              name: language.replies.fields.noRole + ":",
              value: language.replies.values.noRole.replaceValues({
                link: config.discord.noperms_invite.replace("{clientId}", client.user!.id)
              }),
              inline: true
            },
            {
              name: language.replies.fields.links.replaceValues({ username: client.user!.displayName }),
              value: `[Top.gg](https://top.gg/bot/${client.user!.id}) • [Discord.Bots.gg](https://discord.bots.gg/bots/${client.user!.id}) • [Discords.com](https://discords.com/bots/bot/${client.user!.id}) • [DiscordBotList.com](${config.discord.discordbotlist}) • [DiscordList.gg](https://discordlist.gg/bot/${client.user!.id})`,
              inline: false
            }
          )
          .setFooter(
            {
              text: language.replies.embedFooter
            }
          )
          .setTimestamp()
      ];

      const components = [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setEmoji(EmbedData.emotes.default.invite)
              .setLabel(language.replies.fields.suggest)
              .setURL(config.discord.default_invite.replace("{clientId}", client.user!.id))
              .setStyle(ButtonStyle.Link),

            new ButtonBuilder()
              .setEmoji(EmbedData.emotes.default.close)
              .setLabel(language.replies.fields.noRole)
              .setURL(config.discord.noperms_invite.replace("{clientId}", client.user!.id))
              .setStyle(ButtonStyle.Link)
          )
      ];

      return await response(interaction, {
        embeds,
        components
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