import {
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildChannel,
  GuildMember,
  PermissionsBitField
} from "discord.js";
import {
  ErrorCode,
  ErrorDetails
} from "../types/bot/handle.error";
import { CommandType } from "../types/command/type";
import { Respondable } from "../types/bot/discord";
import selectLanguage from "./selectLanguage";
import responseError from "./responseError";
import dbAccess from "../database/dbAccess";
import logError from "./logError";

export default async function checkCmdPerms(
  interaction: Respondable,
  command: CommandType,
  prefix: string | null = null,
  args: string[] | null = null
): Promise<boolean | void> {
  try {
    const
      guildId = interaction.guildId!,
      lang = await dbAccess.getLanguage(guildId),
      language = selectLanguage(lang).replies,
      mentionCommand = prefix
        ? `\`${prefix + command.data.name}${command.data.options?.some((a) => a.type === 1 && a.name === args?.[0])
          ? ` ${command.data.options.find((a) => a.name === args![0])!.name}`
          : ""
        }\``
        : `</${command.data.name}${interaction instanceof CommandInteraction && interaction.command?.options?.some((a) => a.type === 1)
          ? ` ${interaction.command?.options?.find((a) => a.type === 1)!.name}`
          : ""
        }:${command.data.id}> `,

      getSubcommand = interaction instanceof CommandInteraction && interaction.command?.options instanceof CommandInteractionOptionResolver && interaction.command?.options.find(a => a.type === ApplicationCommandOptionType.Subcommand),
      getSubcommandOptions = getSubcommand && command.data.options?.find(option =>
        option.type === ApplicationCommandOptionType.Subcommand && option.name === getSubcommand.name
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
          },
          {
            name: "MISSING_BOT_PERMISSIONS",
            code: ErrorCode.MISSING_BOT_PERMISSIONS,
            message: ErrorDetails[ErrorCode.MISSING_BOT_PERMISSIONS]
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
          language.userPerm.replaceValues({
            mention_command: `\`${mentionCommand}\``,
            user_perms: new PermissionsBitField(command.data.default_member_permissions)
              .toArray()
              .map(a => `"${a}"`)
              .join(", ")
          }),
          undefined,
          {
            name: "MISSING_USER_PERMISSIONS",
            code: ErrorCode.MISSING_USER_PERMISSIONS,
            message: ErrorDetails[ErrorCode.MISSING_USER_PERMISSIONS]
          }
        );

        return true;
      };
    }

    return false;
  }

  catch (e) {
    logError(e);
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