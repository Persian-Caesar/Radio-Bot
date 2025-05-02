const
  error = require("../../functions/error"),
  sendGuildAlert = require("../../functions/sendGuildAlert"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  defaultLanguage = selectLanguage(config.source.default_language),
  replaceValues = require("../../functions/replaceValues");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Guild} guild 
 * @returns {void}
 */
module.exports = async (client, guild) => {
  try {
    return await sendGuildAlert({
      client,
      guild,
      isWebhook: true,
      description: replaceValues(defaultLanguage.replies.guildDelete, {
        guilds: client.guilds.cache.size.toLocaleString()
      })
    })
  } catch (e) {
    error(e)
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