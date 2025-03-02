const
  {
    EmbedBuilder,
    WebhookClient,
    AttachmentBuilder
  } = require("discord.js"),
  post = require("./post"),
  copyright = require("../storage/embed"),
  config = require("../../config"),
  selectLanguage = require("./selectLanguage"),
  defaultLanguage = selectLanguage(config.source.default_language);

/**
 *
 * @param {Error} error
 * @returns {void}
 */
module.exports = function (error) {
  try {
    if (config.source.logger && config.discord.support.webhook.url) {
      let data = {
        avatarURL: config.discord.support.webhook.avatar,
        username: config.discord.support.webhook.username
      };
      const webhook = new WebhookClient(
        {
          url: config.discord.support.webhook.url
        }
      );
      const embed = new EmbedBuilder()
        .setAuthor(
          {
            name: `${error.message}`
          }
        )
        .setFooter(
          {
            text: copyright.footer.footerText,
            iconURL: copyright.footer.footerIcon
          }
        )
        .setTitle(`${copyright.emotes.default.error}| ${defaultLanguage.replies.errorEmbed.title}`)
        .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
        .setColor(copyright.color.theme)
        .addFields(
          [
            {
              name: `${copyright.emotes.default.entry}| ${defaultLanguage.replies.errorEmbed.name}`,
              value: `${error.name}`
            }
          ]
        );

      if (error.code)
        embed.addFields(
          [
            {
              name: `${copyright.emotes.default.prohibited}| ${defaultLanguage.replies.errorEmbed.code}`,
              value: `${error.code}`
            }
          ]
        );

      if (error.status)
        embed.addFields(
          [
            {
              name: `${copyright.emotes.default.globe}| ${defaultLanguage.replies.errorEmbed.httpStatus}`,
              value: `${error.status}`
            }
          ]
        );

      embed.addFields(
        [
          {
            name: `${copyright.emotes.default.clock}| ${defaultLanguage.replies.errorEmbed.timestamp}`,
            value: `**<t:${Date.parse(new Date()) / 1000}:D> | <t:${Date.parse(new Date()) / 1000}:R>**`
          }
        ]
      );
      if (error.stack.length < 4087)
        data.embeds = [embed];

      else {
        data.content = `**${copyright.emotes.default.entry}| ${defaultLanguage.replies.errorEmbed.name} \`${error.name}\`${error.code ?
          `\n${copyright.emotes.default.prohibited}| ${defaultLanguage.replies.errorEmbed.code} \`${error.code}\`` : ""
          }${error.status ?
            `\n${copyright.emotes.default.globe}| ${defaultLanguage.replies.errorEmbed.httpStatus} \`${error.status}\`` : ""
          }\n${copyright.emotes.default.clock}| ${defaultLanguage.replies.errorEmbed.timestamp} <t:${Date.parse(new Date()) / 1000}:D> | <t:${Date.parse(new Date()) / 1000}:R>**`;
        data.files = [
          new AttachmentBuilder()
            .setDescription(error.name)
            .setName("error_message.txt")
            .setFile(Buffer.from(error.stack))
        ];
      }

      if (config.discord.support.webhook.threads.bugs)
        data.threadId = config.discord.support.webhook.threads.bugs;

      return webhook.send(data);
    } else
      console.log(error);

  } catch (e) {
    post(defaultLanguage.replies.webhookBug, "E", "red", "redBright");
    console.log(e);
    post(defaultLanguage.replies.mainErrorLog, "E", "red", "redBright");
    console.log(error);
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