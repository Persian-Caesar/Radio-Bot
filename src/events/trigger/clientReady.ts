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
    const trigger_interval = config.discord.support.update_stats_interval;
    if (config.discord.support.id.length < 1)
      return;

    const defaultLanguage = selectLanguage(config.discord.default_language);
    const guild = client.guilds.cache.get(config.discord.support.id)!;
    if (!guild)
      return;

    const guildId = guild.id;
    const channel = guild.channels.cache.get(config.discord.support.stats_channel) as TextChannel | undefined;

    if (guild && channel) {
      setInterval(async () => {
        const status_message = await dbAccess.getStatus(guildId);

        const embed = EmbedBuilder.from((await StatusEmbedBuilder(client))!);
        const row = [
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel(defaultLanguage.replies.status.refresh)
                .setEmoji(EmbedData.emotes.default.update)
                .setCustomId("refreshStatus")
            ),

          new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(defaultLanguage.replies.status.invite)
                .setEmoji(EmbedData.emotes.default.invite)
                .setURL(config.discord.default_invite.replaceValues({ clientId: client.user!.id })),

              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(defaultLanguage.replies.status.vote)
                .setEmoji(EmbedData.emotes.default.topgg)
                .setURL(`https://top.gg/bot/${client.user!.id}/vote`)
            )
        ];

        let msg: Message | undefined;
        try {
          if (status_message)
            msg = channel.messages.cache.get(status_message);
        }

        catch { };

        if (status_message && msg) {
          // auto update message
          if (config.discord.support.update_stats_message)
            await msg.edit({
              embeds: [embed]
            });

          return;
        }

        else {
          const msg = await channel.send({
            embeds: [embed],
            components: row
          })

          await dbAccess.setStatus(guildId, msg.id)
          return;
        }
      }, trigger_interval);
    };

    return;
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