import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionsBitField
} from "discord.js";
import {
  ErrorCode,
  ErrorDetails
} from "../../types/bot/handle-error";
import { CommandType } from "../../types/command/type";
import checkPlayerPerms from "../../utils/permission/checkPlayerPerms";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/response/responseError";
import radiostation from "../../storage/radiostation.json";
import MusicPlayer from "../../model/MusicPlayer";
import response from "../../utils/response/response";
import dbAccess from "../../database/dbAccess";
import logError from "../../utils/logError";
import config from "../../../config";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.play;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "play",
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
        name: "station",
        description: defaultLanguage.options.station,
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
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

  run: async (client, interaction) => {
    try {
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang).commands.play;
      const query = interaction.options.getString("station");
      const panelId = await dbAccess.getPanel(guildId);

      // Check perms
      if (await checkPlayerPerms(interaction))
        return;

      if (panelId)
        if (interaction.channel!.id !== panelId.channel)
          return await responseError(
            interaction,
            language.replies.onlyPanel.replaceValues({
              channel: panelId.channel
            }),
            undefined,
            {
              name: "WRONG_CHANNEL_EXECUTION",
              code: ErrorCode.WRONG_CHANNEL_EXECUTION,
              message: ErrorDetails[ErrorCode.WRONG_CHANNEL_EXECUTION]
            }
          );

      if (!query)
        return await responseError(
          interaction,
          language.replies.invalidQuery.replaceValues({
            stations: JSON.stringify(Object.keys(radiostation), null, 2)
          }),
          undefined,
          {
            name: "MISSING_ARGUMENT",
            code: ErrorCode.MISSING_ARGUMENT,
            message: ErrorDetails[ErrorCode.MISSING_ARGUMENT]
          }
        );

      const firstChoice = Object
        .keys(radiostation)
        .filter(a =>
          (a.toLowerCase()).startsWith(query.toLowerCase() || "")
        )
        .random();

      // Start to playe
      const player = new MusicPlayer(interaction);

      await player.radio(radiostation[firstChoice as "Persian Rap"]);
      await dbAccess.setStation(guildId, firstChoice);
      await response(interaction, {
        content: language.replies.play.replaceValues({
          song: firstChoice
        })
      });

      return
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