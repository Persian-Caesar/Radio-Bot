import {
  ErrorCode,
  ErrorDetails
} from "../types/bot/handle.error";
import { Respondable } from "../types/bot/discord";
import { GuildMember } from "discord.js";
import selectLanguage from "./selectLanguage";
import responseError from "./response/responseError";
import MusicPlayer from "../model/MusicPlayer";
import dbAccess from "../database/dbAccess";
import logError from "./logError";
import config from "../../config";

export default async function (interaction: Respondable, player?: MusicPlayer) {
  try {
    const guildId = interaction.guildId!;
    const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
    const language = selectLanguage(lang);
    const member = interaction.member as GuildMember;
    const channel = member?.voice?.channel;

    if (!channel || !channel.id) {
      await responseError(
        interaction,
        language.replies.noChannelError,
        undefined,
        {
          name: "CHANNEL_NOT_FOUND",
          code: ErrorCode.CHANNEL_NOT_FOUND,
          message: ErrorDetails[ErrorCode.CHANNEL_NOT_FOUND]
        }
      );

      return true;
    }

    if (!channel.viewable) {
      await responseError(
        interaction,
        language.replies.noPermToView,
        undefined,
        {
          name: "NOT_VIEWABLE",
          code: ErrorCode.NOT_VIEWABLE,
          message: ErrorDetails[ErrorCode.NOT_VIEWABLE]
        }
      );

      return true;
    };

    if (!channel.joinable) {
      await responseError(
        interaction,
        language.replies.noPermToConnect,
        undefined,
        {
          name: "NOT_JOINABLE",
          code: ErrorCode.NOT_JOINABLE,
          message: ErrorDetails[ErrorCode.NOT_JOINABLE]
        }
      );

      return true;
    }

    if (channel.full) {
      await responseError(
        interaction,
        language.replies.channelFull,
        undefined,
        {
          name: "CHANNEL_FULL",
          code: ErrorCode.CHANNEL_FULL,
          message: ErrorDetails[ErrorCode.CHANNEL_FULL]
        }
      );

      return true;
    }

    if (member.voice.deaf) {
      await responseError(
        interaction,
        language.replies.userDeaf,
        undefined,
        {
          name: "USER_DEAFENED",
          code: ErrorCode.USER_DEAFENED,
          message: ErrorDetails[ErrorCode.USER_DEAFENED]
        }
      );

      return true;
    };

    if (player && (channel.id !== player.data!.channelId)) {
      await responseError(
        interaction,
        language.replies.notMatchedVoice,
        undefined,
        {
          name: "voi.VOICE_CHANNEL_MISMATCH",
          code: ErrorCode.VOICE_CHANNEL_MISMATCH,
          message: ErrorDetails[ErrorCode.VOICE_CHANNEL_MISMATCH]
        }
      );

      return true;
    }

    if (interaction.guild!.members.me?.voice?.mute) {
      await responseError(
        interaction,
        language.replies.clientMute,
        undefined,
        {
          name: "CLIENT_MUTED",
          code: ErrorCode.CLIENT_MUTED,
          message: ErrorDetails[ErrorCode.CLIENT_MUTED]
        }
      );

      return true;
    }

    return false;
  }

  catch (e) {
    logError(e);
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