const
  { EmbedBuilder } = require("discord.js"),
  error = require("./error"),
  embed = require("../storage/embed"),
  selectLanguage = require("./selectLanguage"),
  database = require("./database"),
  config = require("../../config");

/**
 *
 * @param {{interaction: import("discord.js").CommandInteraction, data: import("discord.js").BaseMessageOptions, log: string, isUpdateNeed: boolean, message: import("discord.js").Message}} param0
 * @returns {import("discord.js").InteractionResponse}
 */
module.exports = async function ({
  interaction,
  data = null,
  log = null,
  isUpdateNeed = false,
  message = null
}) {
  try {
    const
      db = new database(interaction.client.db),
      databaseNames = {
        language: `language.${interaction.guildId}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang);

    if (data === null)
      data = {
        embeds: [
          new EmbedBuilder()
            .setColor(embed.color.red)
            .setFooter(
              {
                text: embed.footer.footerText,
                iconURL: embed.footer.footerIcon
              }
            )
            .setTitle(language.replies.error)
            .setDescription(log)
        ]
      };

    if (interaction.user) {
      data.ephemeral = true;
      if (isUpdateNeed)
        return await interaction.editReply(data);

      else return await interaction.reply(data);
    }

    else {
      if (isUpdateNeed && message) return await message.edit(data);

      else return await interaction.reply(data);
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