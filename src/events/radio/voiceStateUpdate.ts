import { VoiceState } from "discord.js";
import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import PlayerManager from "../../model/PlayerManager";
import logError from "../../components/logError";
import dbAccess from "../../database/dbAccess";

export default async (client: DiscordClient, oldState: VoiceState, newState: VoiceState) => {
  try {
    const guildId = newState.guild.id || oldState.guild.id;

    // 1. Check if AFK is enabled for this guild
    const afkChannelId = await dbAccess.getAfk(guildId);
    if (!afkChannelId)
      return;

    // 2. Get or Create a persistent player from client (to avoid memory leaks)
    // assuming client.players is a Map<string, PlayerManager>
    let player = client.players?.get(guildId);
    if (!player) {
      player = new PlayerManager();
      player.setData({
        channelId: afkChannelId,
        guildId: guildId,
        adapterCreator: newState.guild.voiceAdapterCreator,
        selfDeaf: true
      });
      client.players?.set(guildId, player);
    }

    const botId = client.user!.id;
    const voiceChannel = newState.channel || oldState.channel;
    if (!voiceChannel) return;

    // Count humans in the channel
    const humans = voiceChannel.members.filter(m => !m.user.bot).size;

    // SCENARIO A: Bot was disconnected manually or by error (Keep it in voice)
    const botIsDisconnected = !newState.channelId;

    if (oldState.member?.id === botId && botIsDisconnected) {
      const connection = player.join();
      connection.subscribe(player.player);
      return;
    }

    // SCENARIO B: Last human left (Pause to save CPU/RAM)
    if (humans === 0 && !player.isPaused()) {
      return player.pause();
    }

    // SCENARIO C: A human joined (Resume or Start Radio)
    if (humans > 0) {
      if (player.isPaused()) {
        return player.resume();
      }

      // If player is idle and someone is there, start the radio
      if (player.player.state.status === "idle") {
        const station = await dbAccess.getStation(guildId) || "Lofi Radio";

        return await player.radio(radiostation[station as keyof typeof radiostation]);
      }
    }
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