import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember
} from "discord.js";
import EmbedData from "../storage/EmbedData";

export function createConfirmationMessage(
  text: string,
  yesId: string = "action-yes",
  noId: string = "action-no"
) {
  return {
    embeds: [
      new EmbedBuilder()
        .setDescription(text)
        .setColor(EmbedData.color.none.HexToNumber())
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("بله")
          .setCustomId(yesId)
          .setEmoji("✅")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel("خیر")
          .setCustomId(noId)
          .setEmoji("❌")
          .setStyle(ButtonStyle.Secondary)
      )
    ]
  };
}

export function canManage(target: GuildMember, issuer: GuildMember, botMember: GuildMember): boolean {
  return issuer.roles.highest.position > target.roles.highest.position &&
    botMember.roles.highest.position > target.roles.highest.position;
}

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */