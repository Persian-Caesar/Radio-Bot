const
  { EmbedBuilder } = require("discord.js"),
  error = require("./error"),
  os = require("os"),
  data = require("../storage/embed"),
  config = require("../../config"),
  selectLanguage = require("./selectLanguage"),
  defaultLanguage = selectLanguage(config.source.default_language);

/**
 *
 * @param {import("discord.js").Client} client
 * @returns {import("discord.js").EmbedBuilder}
 */
module.exports = async function (client) {
  try {
    return new EmbedBuilder()
      .setColor(data.color.theme)
      .setTitle(defaultLanguage.replies.status.title)
      .addFields(
        [
          {
            name: `${data.emotes.default.server}| ${defaultLanguage.replies.status.guilds}`,
            value: `**\`${client.guilds.cache.size.toLocaleString()}\` Servers**`,
            inline: false
          },
          {
            name: `${data.emotes.default.users}| ${defaultLanguage.replies.status.users}`,
            value: `**\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\` Users**`,
            inline: false
          },
          {
            name: `${data.emotes.default.commands}| ${defaultLanguage.replies.status.commands}`,
            value: `**slashCommands[\`${client.commands.filter(a => a.only_slash).size}\`] & messageCommands[\`${client.commands.filter(a => a.only_message).size}\`]**`,
            inline: false
          },
          {
            name: `${data.emotes.default.heartbeat}| ${defaultLanguage.replies.status.ping}`,
            value: `**\`${Math.round(client.ws.ping)}\` ms**`,
            inline: false
          },
          {
            name: `${data.emotes.default.uptime}| ${defaultLanguage.replies.status.uptime}`,
            value: `**<t:${Math.round(client.readyTimestamp / 1000)}:D> | <t:${Math.round(client.readyTimestamp / 1000)}:R>**`,
            inline: false
          },
          {
            name: `${data.emotes.default.memory}| ${defaultLanguage.replies.status.memory}`,
            value: `**${Math.round(((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)).toLocaleString()}/${Math.round(((os.totalmem()) / 1024 / 1024).toFixed(2)).toLocaleString()} MB | \`${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%\`**`,
            inline: false
          },
          {
            name: `${data.emotes.default.cpu}| ${defaultLanguage.replies.status.cpu}`,
            value: `**${os.cpus().map((i) => `${i.model}`)[0]} | \`${String(os.loadavg()[0])}%\`**`,
            inline: false
          },
          {
            name: `${data.emotes.default.version}| ${defaultLanguage.replies.status.version}`,
            value: `**Source \`v${require("../../package.json").version}\` | Discord.JS \`v${require(`discord.js`).version}\`**`,
            inline: false
          }
        ]
      ).toJSON();
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
