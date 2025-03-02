const
  {
    PermissionsBitField,
    ApplicationCommandOptionType
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
      db = new database(interaction.client.db),
      databaseNames = {
        language: `language.${interaction?.guild?.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies,
      mentionCommand = prefix ?
        `\`${prefix + command.data.name}${await command.data?.options?.some(a => a.type === 1 && a.name === args[0]) ?
          ` ${await command.data?.options?.find(a => a.name === args[0]).name}` : ""}\`` : `</${command.data.name}${await interaction?.options?.data?.some(a => a.type === 1) ?
            ` ${await interaction?.options?.data?.find(a => a.type === 1).name}` : ""}:${command.data.id}>`;

    if (!interaction.channel.permissionsFor(interaction.client.user).has(command.data.default_bot_permissions || [])) {
      await sendError({
        interaction,
        data: {
          content: replaceValues(language.botPerm, {
            mention_command: mentionCommand,
            bot_perms: new PermissionsBitField(command.data.default_bot_permissions)
              .toArray()
              .map(a => `"${a}"`)
              .join(", ")
          })
        }
      });

      return true;
    };

    if (!interaction.member.permissions.has(command.data.default_member_permissions || [])) {
      await sendError({
        interaction,
        data: {
          content: replaceValues(language.userPerm, {
            mention_command: `\`${mentionCommand}\``,
            user_perms: new PermissionsBitField(command.data.default_member_permissions)
              .toArray()
              .map(a => `"${a}"`)
              .join(", ")
          })
        }
      });

      return true;
    };

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