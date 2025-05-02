const
  {
    EmbedBuilder,
    WebhookClient
  } = require("discord.js"),
  error = require("./error"),
  copyRight = require("../storage/embed"),
  config = require("../../config"),
  selectLanguage = require("./selectLanguage"),
  defaultLanguage = selectLanguage(config.source.default_language),
  createORgetInvite = require("./createORgetInvite");

/**
 *
 * @param {{ client: import("discord.js").Client, guild: import("discord.js").Guild, guildChannel: import("discord.js").GuildChannel, isWebhook: boolean, description: string }} param0
 * @returns {import("discord.js").Message}
 */
module.exports = async function ({
  client,
  guild,
  guildChannel = null,
  isWebhook = false,
  description = defaultLanguage.replies.guildAlert
}) {
  try {
    let
      channel,
      owner = {},
      invite = await createORgetInvite(guild),
      messageData = {};

    if (isWebhook) {
      channel = new WebhookClient({ url: config.discord.support.webhook.url });
      messageData.avatarURL = config.discord.support.webhook.avatar;
      messageData.username = config.discord.support.webhook.username;
      if (config.discord.support.webhook.threads.status)
        messageData.threadId = config.discord.support.webhook.threads.status;
    }

    else
      channel = guildChannel;

    try {
      owner = await guild?.fetchOwner();
      if (!owner.user)
        owner = await (await guild.fetch()).fetchOwner();

      if (!owner.user)
        owner.user = await client.users.cache.get(guild.ownerId);

    } catch { }
    const embed = new EmbedBuilder()
      .setDescription(description.replace("{guilds}", await client.guilds.cache.size.toLocaleString()))
      .addFields(
        [
          {
            name: `${copyRight.emotes[isWebhook ? "default" : "theme"].owner}| ${defaultLanguage.replies.guild.owner}`,
            value: `${copyRight.emotes[isWebhook ? "default" : "theme"].reply} **${owner?.user} | \`${owner?.user?.tag}\` | \`${owner?.user?.id || guild.ownerId}\`**`,
            inline: false
          },
          {
            name: `${copyRight.emotes[isWebhook ? "default" : "theme"].server}| ${defaultLanguage.replies.guild.guild}`,
            value: `${copyRight.emotes[isWebhook ? "default" : "theme"].reply} **${invite ? `[${guild.name}](${invite.url})` : `${guild.name}`} | \`${guild.id}\` | \`${guild.memberCount}\` Members**`,
            inline: false
          },
          {
            name: `${copyRight.emotes[isWebhook ? "default" : "theme"].date}| ${defaultLanguage.replies.guild.createdAt}`,
            value: `${copyRight.emotes[isWebhook ? "default" : "theme"].reply} **<t:${Date.parse(guild.createdAt) / 1000}:D> | <t:${Date.parse(guild.createdAt) / 1000}:R>**`,
            inline: false
          }
        ]
      )
      .setColor(description.includes("revoked") ? copyRight.color.redlight : description.includes("join") ? copyRight.color.greenlight : copyRight.color.theme)
      .setThumbnail(guild.iconURL({ forceStatic: true }))
      .setFooter(
        {
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL({ forceStatic: true })
        }
      )
      .setTimestamp(Date.now());

    try {
      embed.setAuthor(
        {
          name: owner.user.tag,
          iconURL: owner.user.displayAvatarURL({ forceStatic: true })
        }
      )
    } catch { }

    messageData.embeds = [embed];
    return await channel.send(messageData);
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