import {
  ApplicationCommandType,
  AttachmentBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField
} from "discord.js";
import {
  getMember,
  getOption
} from "../../functions/functions";
import { CommandType } from "../../types/interfaces";
import getLinkResponse from "../../functions/getLinkResponse";
import HexToNumber from "../../functions/HexToNumber";
import EmbedData from "../../storage/embed";
import getAuthor from "../../utils/getAuthor";
import response from "../../utils/response";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "nekos",
    description: "دستورات سرگرم کننده نکوس.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
    ]),
    default_bot_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks
    ]),
    options: []
  },
  category: "api",
  aliases: ["h", "commands"],
  cooldown: 10,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      const
        user = getAuthor(interaction)!,
        Subcommand = getOption<string>(interaction, "getSubcommand", undefined, 0, args),
        member = getMember(interaction, getOption<any>(interaction, "getMember", "user", 1, args)!)!;

      switch (Subcommand) {
        case "kiss": {
          const image = await getLinkResponse("nekos", "/kiss");
          return await response(interaction, {
            embeds: [
              new EmbedBuilder()
                .setTitle("OMG!!!")
                .setDescription(`\`${user.username}\` start kissing **${member.user.username}**`)
                .setColor(HexToNumber(EmbedData.color.pink))
                .setFooter({ text: "This image maked by \"nekos.life\" api." })
                .setTimestamp()
                .setImage(`attachment://kiss.gif`)
            ],
            files: [new AttachmentBuilder(image.url, { name: 'kiss.gif' })]
          })
        }

        case "hug": {
          const image = await getLinkResponse("nekos", "/hug");
          return await response(interaction, {
            embeds: [
              new EmbedBuilder()
                .setTitle("OMG!!!")
                .setDescription(`\`${user.username}\` start hugging **${member.user.username}**`)
                .setColor(HexToNumber(EmbedData.color.pink))
                .setFooter({ text: "This image maked by \"nekos.life\" api." })
                .setTimestamp()
                .setImage(`attachment://hug.gif`)
            ],
            files: [new AttachmentBuilder(image.url, { name: 'hug.gif' })]
          })
        }

        case "slap": {
          const image = await getLinkResponse("nekos", "/v2/img/slap");
          return await response(interaction, {
            embeds: [
              new EmbedBuilder()
                .setTitle(`OMG!!!`)
                .setDescription(`\`${user.username}\` get slap to **${member.user.username}**`)
                .setColor(HexToNumber(EmbedData.color.pink))
                .setFooter({ text: "This image maked by \"nekos.life\" api." })
                .setTimestamp()
                .setImage("attachment://slap.gif")
            ],
            files: [new AttachmentBuilder(image.url, { name: "slap.gif" })]
          })
        }

        case "pat": {
          const image = await getLinkResponse("nekos", "/v2/img/pat");
          return await response(interaction, {
            embeds: [
              new EmbedBuilder()
                .setTitle(`OMG!!!`).setDescription(`\`${user.username}\` start caressing to **${member.user.username}**`)
                .setColor(HexToNumber(EmbedData.color.pink))
                .setFooter({ text: "This image maked by \"nekos.life\" api." })
                .setTimestamp()
                .setImage("attachment://pat.gif")
            ],
            files: [new AttachmentBuilder(image.url, { name: "pat.gif" })]
          })
        }

        case "feed": {
          const image = await getLinkResponse("nekos", "/v2/img/feed");
          return await response(interaction, {
            embeds: [
              new EmbedBuilder()
                .setTitle("OMG!!!")
                .setDescription(`\`${user.username}\` is feeding\ **${member.user.username}**`)
                .setColor(HexToNumber(EmbedData.color.pink))
                .setFooter({ text: "This image maked by \"nekos.life\" api." })
                .setTimestamp()
                .setImage("attachment://feed.gif")
            ],
            files: [new AttachmentBuilder(image.url, { name: "feed.gif" })]
          })
        }
      }
    } catch (e: any) {
      error(e)
    }
  }
};
export default command;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */