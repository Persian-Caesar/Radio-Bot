const
  error = require("../../functions/error"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  checkCmdPerms = require("../../functions/checkCmdPerms"),
  checkCmdCooldown = require("../../functions/checkCmdCooldown"),
  database = require("../../functions/database"),
  replaceValues = require("../../functions/replaceValues");

/**
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @returns {void}
 */
module.exports = async (client, message) => {
  try {
    const
      db = new database(client.db),
      databaseNames = {
        prefix: `prefix.${message.guildId}`,
        language: `langu.age.${message.guildId}`
      };

    // Filter dm channels, webhooks, the bots
    // if (message.channel.type === 1 || !message || message?.webhookId || message.author?.bot)
    // return;

    // Filter all guilds
    if (config.source.one_guild && message.guildId !== config.discord.support.id)
      return;

    // Select Guild Language
    const
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies,

      // Command Prefix & args
      stringPrefix = (await db.has(databaseNames.prefix)) ?
        await db.get(databaseNames.prefix) : `${config.discord.prefix}`,

      prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${stringPrefix.toString().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\s*`
      );

    // Send prefix to channel
    if (message.guild && message.content === client.user.toString())
      return await message.reply({
        content: replaceValues(language.sendPrefix, {
          prefix: stringPrefix
        })
      });

    if (!prefixRegex.test(message.content.toLowerCase())) return;

    const [prefix] = message.content.toLowerCase().match(prefixRegex);
    if (message.content.toLowerCase().indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    if (!commandName) return;

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
      );

    // Command Handler
    if (command && command.only_message) {
      if (message.channel.type === 1 && !command.data.dm_permission)
        return;

      // Start to Typing
      await message.channel.sendTyping();

      // Filter Owners Commands
      if (command.only_owner)
        if (!config.discord.support.owners.includes(message.author.id))
          return;

      // Check Perms
      if (message.guild)
        if (await checkCmdPerms(message, command, stringPrefix, args))
          return;

      // Cooldown
      if (await checkCmdCooldown(message, command, stringPrefix, args))
        return;

      // Command Handler
      await db.add("totalCommandsUsed", 1);
      return await command.run(client, message, args);
    }
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