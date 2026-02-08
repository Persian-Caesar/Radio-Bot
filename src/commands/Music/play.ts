import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionsBitField
} from "discord.js";
import {
  getOption,
  isBaseInteraction
} from "../../utils/interactionTools";
import { CommandType } from "../../types/interfaces";
import checkPlayerPerms from "../../utils/checkPlayerPerms";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/responseError";
import radiostation from "../../storage/radiostation.json";
import MusicPlayer from "../../model/MusicPlayer";
import response from "../../utils/response";
import dbAccess from "../../database/dbAccess";
import config from "../../../config";
import error from "../../utils/error";

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
    dm_permission: true,
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
  aliases: ["p"],
  only_owner: false,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang).commands.play;
      const query = isBaseInteraction(interaction) ? getOption<string>(interaction, "getString", "station") : args!.join(" ");
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
            })
          );

      if (!query)
        return await responseError(
          interaction,
          language.replies.invalidQuery.replaceValues({
            stations: JSON.stringify(Object.keys(radiostation))
          })
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