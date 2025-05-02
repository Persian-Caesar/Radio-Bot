import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  AttachmentBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  PermissionsBitField
} from "discord.js";
import { EphemeralOption } from "../../functions/functions";
import { CommandType } from "../../types/interfaces";
import GenerateKissImage from "../../classes/GenerateKissImage";
import responseError from "../../utils/responseError";
import HexToNumber from "../../functions/HexToNumber";
import capitalize from "../../functions/capitalize";
import EmbedData from "../../storage/embed";
import getAuthor from "../../utils/getAuthor";
import response from "../../utils/response";
import error from "../../utils/error";

const kiss_types = [
  "two-boys",
  "two-girls",
  "boy-girl",
  "girl-boy"
];

const command: CommandType = {
  data: {
    name: "image-create",
    description: "ساخت عکس های بامزه.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
    ]),
    default_bot_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks
    ]),
    options: [
      {
        name: "kiss",
        description: "ساخت عکس بوسیدن یوزر.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "یک یوزر انتخاب کنید.",
            type: ApplicationCommandOptionType.User,
            required: true
          },
          {
            name: "type",
            description: "کدوم نوع سبک تصویر رو میخوای؟",
            type: ApplicationCommandOptionType.String,
            choices: kiss_types.map(a => ({
              name: capitalize(a.replace("-", " ")),
              value: a
            })),
            required: true
          },
          EphemeralOption()
        ]
      }
    ]
  },
  category: "image",
  aliases: ["h", "commands"],
  cooldown: 10,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      const
        user = getAuthor(interaction)!,
        Subcommand = interaction instanceof CommandInteraction && interaction.options instanceof CommandInteractionOptionResolver ? interaction.options.getSubcommand() : args![0];

      switch (Subcommand) {
        case "kiss": {
          const
            member = interaction instanceof CommandInteraction && interaction.options instanceof CommandInteractionOptionResolver ? interaction.options.getMember("user") : interaction instanceof Message && interaction.mentions.members?.first() || interaction.guild?.members.cache.get(args![1]),
            type = interaction instanceof CommandInteraction && interaction.options instanceof CommandInteractionOptionResolver ? interaction.options.getString("type") : args![2],
            types = ["gay", "lesbian"];

          if (!member)
            return await responseError(interaction, "لطفا یوزر را وارد کنید.");

          if (!type || !types.includes(type.toLowerCase()))
            return await responseError(interaction, `فقط میتوانید دو نوع را انتخاب کنید:\n [ ${types.join(" | ")} ]`);

          switch (type) {
            case "gay": {
              const image = await new GenerateKissImage(
                user.displayAvatarURL({ extension: "png", forceStatic: true }),
                member.displayAvatarURL({ extension: "png", forceStatic: true }),
                true
              ).generate();
              return await response(interaction, {
                embeds: [
                  new EmbedBuilder()
                    .setTitle("OMG!!!")
                    .setDescription(`\`${user.username}\` start kissing **${member.user.username}**`)
                    .setColor(HexToNumber(EmbedData.color.pink))
                    .setTimestamp()
                    .setImage(`attachment://${type}-kiss.png`)
                ],
                files: [
                  new AttachmentBuilder(image!, { name: type + "-kiss.png" })
                ]
              });
            }
            case "lesbian": {
              const image = await new GenerateKissImage(
                user.displayAvatarURL({ extension: "png", forceStatic: true }),
                member.displayAvatarURL({ extension: "png", forceStatic: true }),
                false,
                true
              ).generate();
              return await response(interaction, {
                embeds: [
                  new EmbedBuilder()
                    .setTitle("OMG!!!")
                    .setDescription(`\`${user.username}\` start kissing **${member.user.username}**`)
                    .setColor(HexToNumber(EmbedData.color.pink))
                    .setTimestamp()
                    .setImage(`attachment://${type}-kiss.png`)
                ],
                files: [
                  new AttachmentBuilder(image!, { name: type + "-kiss.png" })
                ]
              });
            }
          }
          break;
        }

        default: {
          break;
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