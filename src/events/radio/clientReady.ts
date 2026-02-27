import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import PlayerManager from "../../model/PlayerManager";
import dbAccess from "../../database/dbAccess";
import logError from "../../components/logError";

export default async (client: DiscordClient) => {
  try {
    await Promise.all(
      client.guilds.cache.map(async (guild) => {
        const guildId = guild.id!;
        const channelId = await dbAccess.getAfk(guildId);
        const station = await dbAccess.getStation(guildId) || "Lofi Radio";

        if (channelId) {
          const player = new PlayerManager()
            .setData({
              channelId: channelId,
              guildId: guild.id,
              adapterCreator: guild.voiceAdapterCreator
            });

          await player.radio(radiostation[station as "Lofi Radio"]);

          return;
        }

        return;
      })

    );

    return;
  }

  catch (e) {
    logError(e);
  }
};

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */