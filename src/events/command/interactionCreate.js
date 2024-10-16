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
        language: `language.${interaction.guild.id}`
      },

      // Select Guild Language
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies;

    // Load Slash Commands
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      // Command Handler
      if (command && command.only_slash) {
        const args = [];
        for (let option of interaction.options.data) {
          if (option.type === 1) {
            if (option.name) args.push(option.name);

            option.options?.forEach((x) => {
              if (x.value) args.push(x.value);
            })
          } else if (option.value) args.push(option.value);
        };

        // Filter Owners Commands
        if (command.only_owner)
          if (!config.discord.support.owners.includes(interaction.user.id))
            return await sendError({
              interaction,
              log: language.onlyOwner
            });


        // Check command perms
        if (await checkCmdPerms(interaction, command))
          return;

        // Command cooldown
        if (await checkCmdCooldown(interaction, command))
          return;

        // Command Handler 
        if (command.data.options && (command.data.options?.find(a => a.name === "ephemeral") || command.data.options?.filter(a => a.type === 1)?.find(a => a.options?.find(b => b.name === "ephemeral"))))
          await interaction.deferReply({
            ephemeral: interaction.options.getString("ephemeral") === "true" ? true : false,
            fetchReply: true
          });

        await db.add("totalCommandsUsed", 1);
        return command.run(client, interaction, args);
      }
    }
  } catch (e) {
    error(e);
  }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */