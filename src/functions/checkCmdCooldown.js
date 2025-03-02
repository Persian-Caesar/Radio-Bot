const
  {
    Collection
  } = require("discord.js"),
  error = require("./error"),
  selectLanguage = require("./selectLanguage"),
  config = require("../../config"),
  sendError = require("./sendError"),
  database = require("./database"),
  replaceValues = require("./replaceValues");

/**
 *
 * @param {import("discord.js").CommandInteraction} interaction
 * @param {import("../commands/Misc/help")} command
 * @param {string} prefix
 * @param {Array<string>} args
 * @returns {import("discord.js").InteractionResponse}
 */
module.exports = async function (interaction, command, prefix = null, args = null) {
  try {
    const
      client = interaction.client,
      db = new database(client.db),
      userId = interaction?.member?.id || interaction?.user?.id || interaction?.author?.id,
      databaseNames = {
        language: `language.${interaction?.guildId}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies,
      mentionCommand = prefix ?
        `\`${prefix + command.data.name}${await command.data?.options?.some(a => a.type === 1 && a.name === args[0]) ?
          ` ${await command.data?.options?.find(a => a.name === args[0]).name}` : ""}\`` : `</${command.data.name}${await interaction?.options?.data?.some(a => a.type === 1) ?
            ` ${await interaction?.options?.data?.find(a => a.type === 1).name}` : ""}:${command.data.id}>`;

    if (!client.cooldowns.has(command.data.name))
      await client.cooldowns.set(command.data.name, new Collection());

    const
      timestamps = await client.cooldowns.get(command.data.name),
      defaultCooldownDuration = 3,
      cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(userId)) {
      const expirationTime = timestamps.get(userId) + cooldownAmount;
      if (Date.now() < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        await sendError({
          interaction: interaction,
          log: replaceValues(language.cooldown, {
            mention_command: mentionCommand,
            expired_timestamp: expiredTimestamp
          })
        });

        return true;
      };
    };

    timestamps.set(userId, Date.now());
    setTimeout(() => timestamps.delete(userId), cooldownAmount);

    return false;
  } catch (e) {
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