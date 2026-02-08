import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Guild,
  GuildMember,
  Message,
  User
} from "discord.js";
import { Respondable } from "../types/types";
import EmbedData from "../storage/EmbedData";

export function isBaseInteraction(obj: Respondable): obj is BaseInteraction {
  return obj instanceof BaseInteraction;
}

export function isMessage(obj: Respondable): obj is Message {
  return obj instanceof Message;
}

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

export function getOption<T>(
  interaction: Respondable,
  method: keyof CommandInteractionOptionResolver,
  optionName?: string,
  fallbackIndex?: number,
  args?: string[]
): T | null {
  const options = (interaction as any).options as any;

  const fn = options[method] as any;
  if (typeof fn === "function") {
    return fn.call(options, optionName, true) as T;
  }

  return (args?.[fallbackIndex!] as unknown as T) ?? null;
}

export function getChannel<T>(interaction: Respondable, optionName?: string, fallbackIndex?: number, args?: string[]) {
  if (interaction instanceof CommandInteraction && interaction.command!.options instanceof CommandInteractionOptionResolver)
    return interaction.command!.options.getChannel(optionName || "channel") as T

  return args && args[fallbackIndex!] ? (interaction.guild?.channels.cache.get(args[fallbackIndex!] as string) as T) : null
}

export function getUser(interaction: Respondable, user: User | string) {
  return "id" in (user as User) ?
    user as User
    : interaction.client.users.cache.get(user as string) || interaction.guild?.members.cache.get(user as string)?.user
}

export function getMember(interaction: Respondable, user: GuildMember | string) {
  return "id" in (user as GuildMember) ?
    user as GuildMember
    : interaction.guild?.members.cache.get(user as string)
}

export function filterMembers(guild: Guild, doFor: string, issuer: GuildMember, botMember: GuildMember) {
  return guild.members.cache.filter(m => {
    if (!canManage(m, issuer, botMember))
      return false;

    if (doFor === "everyone")
      return true;

    if (doFor === "bots")
      return m.user.bot;

    return !m.user.bot;
  })
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