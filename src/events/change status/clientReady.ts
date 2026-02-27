import {
  ActivityType,
  PresenceStatusData
} from "discord.js";
import { StatusActivityType } from "../../types/bot/discord";
import DiscordClient from "../../model/Client";
import dbAccess from "../../database/dbAccess";
import logError from "../../utils/logError";
import config from "../../../config";

export default async (client: DiscordClient) => {
  try {
    const { activity, type, presence } = config.discord.status;
    const loopInterval = config.discord.status_loop;

    // Do not start if no activities are configured
    if (!activity?.length) return;

    /**
     * Calculates dynamic placeholders for activity text.
     */
    const buildDynamicData = async () => {
      const totalMembers = client.guilds.cache.reduce(
        (sum, guild) => sum + guild.memberCount,
        0
      );

      const joinedVoiceChannels = client.guilds.cache.filter(guild =>
        guild.voiceStates.cache.get(client.user?.id ?? "")?.channelId
      ).size;

      const totalCommandsUsed =
        (await dbAccess.getTotalCommandsUsed()) ?? 0;

      return {
        username: client.user?.displayName ?? "",
        servers: client.guilds.cache.size.toLocaleString(),
        members: totalMembers.toLocaleString(),
        usedCommands: totalCommandsUsed.toLocaleString(),
        joiendVoiceChannels: joinedVoiceChannels.toLocaleString()
      };
    };

    /**
     * Executes a single presence update cycle.
     */
    const updatePresence = async () => {
      try {
        const randomPresence =
          (presence?.random?.() ?? "online") as PresenceStatusData;

        const randomActivity = activity.random();
        const randomType = (
          type?.random?.() ?? "Custom"
        ) as StatusActivityType;

        const placeholders = await buildDynamicData();

        const activityName = randomActivity.replaceValues(placeholders);

        client.user?.setPresence({
          status: randomPresence,
          activities: [
            {
              type: ActivityType[randomType as "Custom"],
              name: activityName,
              state: randomType === "Custom" ? activityName : undefined
            }
          ]
        });
      } 
      
      catch (err) {
        logError(err);
      }
    };

    // Run immediately once
    updatePresence();

    // Start rotation loop
    setInterval(updatePresence, loopInterval);
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