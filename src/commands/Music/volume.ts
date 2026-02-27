import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  PermissionsBitField
} from "discord.js";
import { CommandType } from "../../types/interfaces";
import checkPlayerPerms from "../../utils/checkPlayerPerms";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/responseError";
import MusicPlayer from "../../model/MusicPlayer";
import EmbedData from "../../storage/EmbedData";
import dbAccess from "../../database/dbAccess";
import response from "../../utils/response";
import logError from "../../utils/logError";
import config from "../../../config";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.volume;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "volume",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      "SendMessages"
    ]),
    default_bot_permissions: new PermissionsBitField([
      "SendMessages",
      "EmbedLinks",
      "Connect",
      "Speak"
    ]),
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

  run: async (client, interaction) => {
    try {
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang);

      // Check perms
      if (await checkPlayerPerms(interaction))
        return;

      // Change the player volume
      const queue = new MusicPlayer(interaction);

      if (!queue || !queue.isConnected())
        return await responseError(
          interaction,
          language.replies.noConnection
        )

      const input = interaction.options.getNumber("input");

      if (!input) {
        const embed = new EmbedBuilder()
          .setColor(EmbedData.color.theme.HexToNumber())
          .setDescription(
            language.commands.volume.replies.currentVolume.replaceValues({
              volume: queue.volume.toString()
            })
          )
          .setFooter(
            {
              text: language.commands.volume.replies.footer
            }
          );

        return await response(interaction, {
          embeds: [embed]
        });
      }

      if (input < 0 || input > 200)
        return await responseError(
          interaction,
          language.commands.volume.replies.invalidInput
        );

      queue.setVolume(input);
      return await response(interaction, {
        content: language.commands.volume.replies.success.replaceValues({
          volume: input.toString()
        })
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