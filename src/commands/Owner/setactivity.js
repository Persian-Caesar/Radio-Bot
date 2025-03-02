const
  {
    ActivityType,
    PermissionFlagsBits,
    PermissionsBitField
  } = require("discord.js"),
  error = require("../../functions/error"),
  response = require("../../functions/response"),
  sendError = require("../../functions/sendError"),
  firstUpperCase = require("../../functions/firstUpperCase"),
  selectArg = require("../../functions/selectArg"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  replaceValues = require("../../functions/replaceValues"),
  language = selectLanguage(config.source.default_language).commands.setactivity;

module.exports = {
  data: {
    name: "setactivity",
    description: language.description,
    default_member_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
    default_bot_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
    dm_permission: true,
    nsfw: false
  },
  category: "owner",
  cooldown: 5,
  aliases: ["sac"],
  only_owner: true,
  only_slash: false,
  only_message: true,

  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @returns {void}
   */
  run: async (client, message, args) => {
    try {
      const
        status = selectArg({ args, name: "status" }),
        activityType = selectArg({ args, name: "type" }).toLowerCase(),
        activityName = selectArg({ args, filter: ["status", "url", "type"], name: "name" }),
        url = selectArg({ args, name: "url" }),
        types = {
          status: ["dnd", "online", "idle", "invisible"],
          activity: Object.keys(ActivityType).filter(a => isNaN(a)).map(a => a.toLowerCase())
        };

      if (!types.status.includes(status))
        return await sendError({
          interaction: message,
          log: replaceValues(language.replies.invalidStatus, {
            status: types.status.join(" | ")
          })
        });

      if (!types.activity.includes(activityType))
        return await sendError({
          interaction: message,
          log: replaceValues(language.replies.invalidActivity, {
            activity: types.activity.join(" | ")
          })
        });

      const data = {
        activities: [
          {
            name: activityName ? activityName : language.replies.activityName,
            type: activityType ? ActivityType[firstUpperCase(activityType)] : 4,
            state: activityName ? activityName : language.replies.activityName,
            url: url ? url : null
          }
        ],
        status: status
      };
      await client.user.setPresence(data);
      return await response(message, {
        content: replaceValues(language.replies.success, {
          data: JSON.stringify(data).toString()
        })
      });
    } catch (e) {
      error(e)
    }
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