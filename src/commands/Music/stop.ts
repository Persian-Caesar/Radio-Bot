import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionsBitField
} from "discord.js";
import { CommandType } from "../../types/interfaces";
import checkPlayerPerms from "../../utils/checkPlayerPerms";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/responseError";
import MusicPlayer from "../../model/MusicPlayer";
import dbAccess from "../../database/dbAccess";
import response from "../../utils/response";
import config from "../../../config";
import error from "../../utils/error";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.stop;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "stop",
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

      // Stop The Player
      if (!player)
        return await responseError(
          interaction,
          language.commands.afk.replies.noPlayerError
        );

      player.stop(true);

      return await response(interaction, {
        content: language.commands.stop.replies.stopped
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