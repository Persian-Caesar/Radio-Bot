import {
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  GuildChannel,
  GuildMember,
  Message,
  MessageFlags,
  PermissionsBitField
} from "discord.js";
import { CommandType } from "../types/interfaces";
import DatabaseProperties from "./DatabaseProperties";
import selectLanguage from "./selectLanguage";
import client from "../..";
import error from "./error";
import responseError from "./responseError";

export default async function checkCmdPerms(
  interaction: CommandInteraction | Message,
  command: CommandType,
  prefix: string | null = null,
  args: string[] | null = null
): Promise<boolean | void> {
  try {
    const
      db = client.db!,
      databaseNames = DatabaseProperties(interaction.guildId!),
      lang = await db.get(databaseNames.language),
      language = (await selectLanguage(lang)).replies,
      mentionCommand = prefix
        ? `\`${prefix + command.data.name}${command.data.options?.some((a) => a.type === 1 && a.name === args?.[0])
          ? ` ${command.data.options.find((a) => a.name === args![0])!.name}`
          : ""
        }\``
        : `</${command.data.name}${interaction instanceof CommandInteraction && interaction.options?.data.some((a) => a.type === 1)
          ? ` ${interaction.options.data.find((a) => a.type === 1)!.name}`
          : ""
        }:${command.data.id}>`,

      getSuncommand = interaction instanceof CommandInteraction && interaction.options instanceof CommandInteractionOptionResolver && interaction.options.getSubcommand(),
      getSubcommandOptions = getSuncommand && command.data.options?.find(option =>
        option.type === ApplicationCommandOptionType.Subcommand && option.name === getSuncommand
      );

    const channel = interaction.channel;
    if (channel && channel.isTextBased() && channel instanceof GuildChannel) {
      const perms = new PermissionsBitField(
        command.data.default_bot_permissions
      );
      if (getSubcommandOptions && getSubcommandOptions.default_bot_permissions)
        perms.add(getSubcommandOptions.default_bot_permissions);

      if (!channel.permissionsFor(interaction.client.user!)?.has(perms || [])) {
        await responseError(
          interaction,
          undefined,
          {
            content: language.botPerm.replaceValues({
              mention_command: mentionCommand,
              bot_perms: new PermissionsBitField(command.data.default_bot_permissions)
                .toArray()
                .map(a => `"${a}"`)
                .join(", ")
            })
          }
        );

        return true;
      }
    }

    const member = interaction.member;
    if (member && member instanceof GuildMember) {
      const perms = new PermissionsBitField(
        command.data.default_member_permissions
      );
      if (getSubcommandOptions && getSubcommandOptions.default_member_permissions)
        perms.add(getSubcommandOptions.default_member_permissions);

      if (!member?.permissions.has(perms || [])) {
        await responseError(
          interaction,
          undefined,
          {
            content: language.userPerm.replaceValues({
              mention_command: `\`${mentionCommand}\``,
              user_perms: new PermissionsBitField(command.data.default_member_permissions)
                .toArray()
                .map(a => `"${a}"`)
                .join(", ")
            })
          }
        );

        return true;
      };
    }

    return false;
  } catch (e: any) {
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