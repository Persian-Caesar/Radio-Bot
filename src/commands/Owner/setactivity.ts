import {
  ActivityType,
  ApplicationCommandType,
  PermissionsBitField,
  PresenceData
} from "discord.js";
import { StatusActivityType } from "../../types/types";
import { CommandType } from "../../types/interfaces";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/responseError";
import response from "../../utils/response";
import config from "../../../config";
import error from "../../utils/error";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.setactivity;

export default {
  data: {
    name: "setactivity",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      "SendMessages"
    ]),
    default_bot_permissions: new PermissionsBitField([
      "SendMessages"
    ]),
    dm_permission: true
  },
  category: "owner",
  cooldown: 5,
  aliases: ["sac"],
  only_owner: true,
  only_slash: false,
  only_message: true,

  run: async (client, message, args) => {
    try {
      const
        status = selectArg({ args: args!, name: "status" }),
        activityType = selectArg({ args: args!, name: "type" }).toLowerCase().toCapitalize() as StatusActivityType,
        activityName = selectArg({ args: args!, filter: ["status", "url", "type"], name: "name" }),
        url = selectArg({ args: args!, name: "url" }),
        types = {
          status: ["dnd", "online", "idle", "invisible"],
          activity: Object.keys(ActivityType).map(a => a.toLowerCase())
        };

      if (!types.status.includes(status))
        return await responseError(
          message,
          defaultLanguage.replies.invalidStatus.replaceValues({
            status: types.status.join(" | ")
          })
        );

      if (!types.activity.includes(activityType))
        return await responseError(
          message,
          defaultLanguage.replies.invalidActivity.replaceValues({
            activity: types.activity.join(" | ")
          })
        );

      const data: PresenceData = {
        activities: [
          {
            name: activityName ? activityName : defaultLanguage.replies.activityName,
            type: activityType ? ActivityType[activityType] : 4,
            state: activityName ? activityName : defaultLanguage.replies.activityName,
            url: url ? url : undefined
          }
        ],
        status: status as "dnd"
      };
      await client.user!.setPresence(data);
      return await response(message, {
        content: defaultLanguage.replies.success.replaceValues({
          data: JSON.stringify(data).toString()
        })
      });

      // Functions
      function selectArg(
        { args, name = null, filter = [] }
          : { args: string[]; name?: string | null; filter?: string[]; }) {
        if (name && !filter)
          return `${args.join(" ").split(name + ":")[1]?.split(" ")[0]}`;

        else
          return args
            .map(string => {
              const regex = new RegExp(`(?:${filter.join("|")}):([^ ]+)`, "g");
              const match = string.replace(regex, "null");
              return match;
            })
            .filter(a => a !== "null")
            .join(" ")
            .replace(name + ":", "");
      }
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