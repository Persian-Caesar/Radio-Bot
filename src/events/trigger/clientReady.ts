import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  TextChannel
} from "discord.js";
import StatusEmbedBuilder from "../../utils/StatusEmbedBuilder";
import selectLanguage from "../../utils/selectLanguage";
import DiscordClient from "../../model/Client";
import EmbedData from "../../storage/EmbedData";
import dbAccess from "../../database/dbAccess";
import config from "../../../config";
import error from "../../utils/error";

export default async (client: DiscordClient) => {
  try {
    const supportGuildId = config.discord.support.id;
    const statsChannelId = config.discord.support.stats_channel;
    const interval = config.discord.support.update_stats_interval;

    if (!supportGuildId)
      return;

    const guild = client.guilds.cache.get(supportGuildId);
    if (!guild)
      return;

    const channel = guild.channels.cache.get(statsChannelId) as TextChannel | undefined;
    if (!channel)
      return;

    const language = selectLanguage(config.discord.default_language);

    const buildComponents = () => [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("refreshStatus")
          .setStyle(ButtonStyle.Secondary)
          .setLabel(language.replies.status.refresh)
          .setEmoji(EmbedData.emotes.default.update)
      ),

      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(language.replies.status.invite)
          .setEmoji(EmbedData.emotes.default.invite)
          .setURL(
            config.discord.default_invite.replaceValues({
              clientId: client.user!.id
            })
          ),

        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(language.replies.status.vote)
          .setEmoji(EmbedData.emotes.default.topgg)
          .setURL(`https://top.gg/bot/${client.user!.id}/vote`)
      )
    ];

    const execute = async () => {
      try {
        const guildId = guild.id;
        const savedMessageId = await dbAccess.getStatus(guildId);

        const embedData = await StatusEmbedBuilder(client);
        if (!embedData) return;

        const embed = EmbedBuilder.from(embedData);
        const components = buildComponents();

        let message: Message | null = null;

        if (savedMessageId) {
          message =
            channel.messages.cache.get(savedMessageId) ??
            (await channel.messages.fetch(savedMessageId).catch(() => null));
        }

        // Update existing message
        if (message) {
          if (config.discord.support.update_stats_message) {
            await message.edit({ embeds: [embed] });
          }

          return;
        }

        // Send new message
        const newMessage = await channel.send({
          embeds: [embed],
          components
        });

        await dbAccess.setStatus(guildId, newMessage.id);

        return;
      }

      catch (err) {
        error(err);
      }
    };

    // Run immediately once
    execute();

    // Then schedule updates
    setInterval(execute, interval);
  }

  catch (e) {
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