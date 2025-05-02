const { MessageFlags } = require("discord.js");
const
  error = require("../../functions/error"),
  config = require("../../../config"),
  sendError = require("../../functions/sendError"),
  selectLanguage = require("../../functions/selectLanguage"),
  database = require("../../functions/database"),
  checkCmdPerms = require("../../functions/checkCmdPerms"),
  checkCmdCooldown = require("../../functions/checkCmdCooldown");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").CommandInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    const
      db = new database(client.db),
      databaseNames = {
        language: `language.${interaction.guildId}`
      },

      // Select Guild Language
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies;

    // Load Slash Commands
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      // Command Handler
      if (command && command.only_slash) {
        if (interaction.channel?.type === 1 && !command.data.dm_permission)
          return;

        // Filter Owners Commands
        if (command.only_owner)
          if (!config.discord.support.owners.includes(interaction.user.id))
            return await sendError({
              interaction,
              log: language.onlyOwner
            });


        // Check command perms
        if (interaction.guild)
          if (await checkCmdPerms(interaction, command))
            return;

        // Command cooldown
        if (await checkCmdCooldown(interaction, command))
          return;

        // Command Handler 
        if (command.data.options && (command.data.options?.find(a => a.name === "ephemeral") || command.data.options?.filter(a => a.type === 1)?.find(a => a.options?.find(b => b.name === "ephemeral"))))
          await interaction.deferReply({
            flags: interaction.options.getString("ephemeral") === "true" ? MessageFlags.Ephemeral : undefined,
            withResponse: true
          });

        await db.add("totalCommandsUsed", 1);
        return await command.run(client, interaction);
      }
    }
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