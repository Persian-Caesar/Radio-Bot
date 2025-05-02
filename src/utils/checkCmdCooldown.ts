import {
  Collection,
  CommandInteraction,
  Message
} from "discord.js";
import { CommandType } from "../types/interfaces";
import DatabaseProperties from "./DatabaseProperties";
import selectLanguage from "./selectLanguage";
import responseError from "./responseError";
import client from "../../index";
import error from "./error";

export default async function checkCmdCooldown(
  interaction: CommandInteraction | Message,
  command: CommandType,
  prefix: string | null = null,
  args: string[] | null = null
): Promise<boolean | void> {
  try {
    const
      db = client.db!,
      userId = (interaction instanceof CommandInteraction ? interaction.user.id : interaction.author?.id),
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
        }:${command.data.id}>`;

    if (!client.cooldowns.has(command.data.name))
      client.cooldowns.set(command.data.name, new Collection());

    const
      timestamps = client.cooldowns.get(command.data.name)!,
      defaultCooldownDuration = 3,
      cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(userId)) {
      const expirationTime = timestamps.get(userId)! + cooldownAmount;
      if (Date.now() < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        await responseError(interaction,
          language.cooldown.replaceValues({
            mention_command: mentionCommand,
            expired_timestamp: expiredTimestamp
          })
        );

        return true;
      };
    };

    timestamps.set(userId, Date.now());
    setTimeout(() => timestamps.delete(userId), cooldownAmount);

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