import { Guild } from "discord.js"
import selectLanguage from "../../components/selectLanguage"
import SendGuildAlert from "../../components/SendGuildAlert"
import DiscordClient from "../../model/Client"
import logError from "../../components/logError"
import config from "../../../config"

export default async (client: DiscordClient, guild: Guild) => {
  try {
    const defaultLanguage = selectLanguage(config.discord.default_language);

    return await SendGuildAlert({
      client,
      guild,
      isWebhook: true,
      description: defaultLanguage.replies.guildCreate.replaceValues({
        guilds: client.guilds.cache.size.toLocaleString()
      })
    })
  }

  catch (e) {
    logError(e)
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