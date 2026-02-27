import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionsBitField
} from "discord.js";
import {
  ErrorCode,
  ErrorDetails
} from "../../types/bot/handle.error";
import { CommandType } from "../../types/command/type";
import checkPlayerPerms from "../../utils/permission/checkPlayerPerms";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/response/responseError";
import MusicPlayer from "../../model/MusicPlayer";
import response from "../../utils/response/response";
import dbAccess from "../../database/dbAccess";
import logError from "../../utils/logError";
import config from "../../../config";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.resume;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "resume",
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

      const player = new MusicPlayer(interaction);

      // Check perms
      if (await checkPlayerPerms(interaction, player))
        return;

      // resume Player
      if (!player)
        return await responseError(
          interaction,
          language.commands.afk.replies.noPlayerError,
          undefined,
          {
            name: "PLAYER_NOT_FOUND",
            code: ErrorCode.PLAYER_NOT_FOUND,
            message: ErrorDetails[ErrorCode.PLAYER_NOT_FOUND]
          }
        );

      player.resume();

      return await response(interaction, {
        content: language.commands.resume.replies.resumed
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