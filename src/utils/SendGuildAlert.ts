import {
  EmbedBuilder,
  GuildMember,
  TextChannel,
  time,
  WebhookClient,
  WebhookMessageCreateOptions
} from "discord.js";
import { SendGuildAlert } from "../types/interfaces";
import selectLanguage from "./selectLanguage";
import EmbedData from "../storage/EmbedData";
import GetInvite from "./GetInvite";
import logError from "./logError";
import config from "../../config";

export default async function SendGuildAlert({
  client,
  guild,
  guildChannel = null,
  isWebhook = false,
  description = "**-# The total number of servers I’m in is now `{guilds}`.**",
  isLeaved = false
}: SendGuildAlert) {
  try {
    const defaultLanguage = selectLanguage(config.discord.default_language);

    let
      channel: WebhookClient | TextChannel | null,
      owner: GuildMember | undefined,
      invite = await GetInvite(guild),
      messageData: WebhookMessageCreateOptions = {};

    if (isWebhook) {
      channel = new WebhookClient({ url: config.discord.support.webhook.status });
      messageData.avatarURL = config.discord.support.webhook.avatar;
      messageData.username = config.discord.support.webhook.username;
    }

    else if (guildChannel)
      channel = guildChannel;

    else if (!channel! || !guildChannel && !isWebhook)
      logError(Error("You didn't add channel or webhook enable."))

    try {
      owner = await guild.fetchOwner() || (await (await guild.fetch()).fetchOwner());
    }

    catch { }

    const guildCreatedAt = Date.parse(guild.createdAt.toString()) / 1000;
    const embed = new EmbedBuilder()
      .setDescription(description.replace("{guilds}", await client.guilds.cache.size.toLocaleString()))
      .addFields(
        [
          {
            name: `${EmbedData.emotes[isWebhook ? "default" : "theme"].owner}| ${defaultLanguage.replies.guild.owner}`,
            value: `${EmbedData.emotes[isWebhook ? "default" : "theme"].reply} **${owner?.user} | \`${owner?.user?.tag}\` | \`${owner?.user?.id || guild.ownerId}\`**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes[isWebhook ? "default" : "theme"].server}| ${defaultLanguage.replies.guild.guild}`,
            value: `${EmbedData.emotes[isWebhook ? "default" : "theme"].reply} **${invite ? `[${guild.name}](${invite.url})` : `${guild.name}`} | \`${guild.id}\` | \`${guild.memberCount}\` Members**`,
            inline: false
          },
          {
            name: `${EmbedData.emotes[isWebhook ? "default" : "theme"].date}| ${defaultLanguage.replies.guild.createdAt}`,
            value: `${EmbedData.emotes[isWebhook ? "default" : "theme"].reply} **${time(guildCreatedAt, "D")} | ${time(guildCreatedAt, "R")}**`,
            inline: false
          }
        ]
      )
      .setColor(
        (isLeaved ?
          EmbedData.color.redlight : EmbedData.color.greenlight
          || EmbedData.color.theme)
          .HexToNumber()
      )
      .setThumbnail(guild.iconURL({ forceStatic: true }))
      .setFooter(
        {
          text: client.user!.tag,
          iconURL: client.user!.displayAvatarURL({ forceStatic: true })
        }
      )
      .setTimestamp(Date.now());

    try {
      embed.setAuthor(
        {
          name: owner!.user.tag,
          iconURL: owner!.user.displayAvatarURL({ forceStatic: true })
        }
      )
    }

    catch { }

    messageData.embeds = [embed];
    return await channel!.send(messageData);
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