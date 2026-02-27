import { StatusActivityType } from "../../types/types";
import { ActivityType } from "discord.js";
import DiscordClient from "../../model/Client";
import dbAccess from "../../database/dbAccess";
import config from "../../../config";
import error from "../../utils/error";

export default async (client: DiscordClient) => {
  try {

    // Change Bot Status
    setInterval(async function () {
      if (config.discord.status.activity.length < 1) return;

      const
        Presence = (config.discord.status.presence || ["online"]).random(),
        Activity = config.discord.status.activity.random(),
        Type = (config.discord.status.type || ["Custom"])
          .random()
          .toLowerCase()
          .toCapitalize() as StatusActivityType,

        stateName = Activity.replaceValues({
          username: client.user!.displayName.toLocaleString(),
          servers: client.guilds.cache.size.toLocaleString(),
          members: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(),
          usedCommands: (await dbAccess.getTotalCommandsUsed() || 0).toLocaleString(),
          joiendVoiceChannels: (
            client.guilds.cache.filter(guild =>
              guild.voiceStates.cache.get(client.user!.id)?.channelId
            ).size || 0
          ).toLocaleString()
        });

      client.user!.setPresence({
        status: Presence,
        activities: [
          {
            type: ActivityType[Type],
            name: stateName,
            state: Type === "Custom" ? stateName : ""
          }
        ]
      });
    }, config.discord.status_loop);
  }

  catch (e) {
    error(e);
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