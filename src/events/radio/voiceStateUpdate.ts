import {
  VoiceChannel,
  VoiceState
} from "discord.js";
import {
  AfkDB,
  StationDB
} from "../../types/database";
import DatabaseProperties from "../../database/dbAccess";
import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import MusicPlayer from "../../model/MusicPlayer";
import error from "../../utils/error";
import dbAccess from "../../database/dbAccess";

export default async (client: DiscordClient, oldState: VoiceState, newState: VoiceState) => {
  try {

    const state = oldState || newState;
    const guildId = state.guild.id;

    const channelId = await dbAccess.getAfk(guildId);
    if (!channelId)
      return;

    const station = await dbAccess.getStation(guildId) || "Lofi Radio";
    const oldHumansInVoiceSize = oldState.channel?.members?.filter(a => !a.user.bot)?.size || 0;
    const newHumansInVoiceSize = newState.channel?.members?.filter(a => !a.user.bot)?.size || 0;
    const botDisconnected = oldState.member?.id === client.user!.id && !newState.channelId;

    const player = new MusicPlayer()
      .setData({
        channelId: channelId,
        guildId: state.guild.id,
        debug: true,
        adapterCreator: state.guild.voiceAdapterCreator
      });

    if (newHumansInVoiceSize === 0 && oldHumansInVoiceSize > 0)
      return player.stop();

    if (oldHumansInVoiceSize === 0 && newHumansInVoiceSize > 0)
      return await player.radio(radiostation[station as "Anime Radio"]);

    if (botDisconnected)
      return player.join();

  }

  catch (e) {
    error(e);
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