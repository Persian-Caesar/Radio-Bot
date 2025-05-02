import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  User,
  ApplicationCommandOptionType,
  ChannelType,
  PermissionsBitField
} from "discord.js";
import { CommandOptions } from "../types/types";
import { CommandOption } from "../types/interfaces";
import { Respondable } from "../types/types";
import { PurgeTypes } from "../storage/array";
import HexToNumber from "./HexToNumber";
import EmbedData from "../storage/embed";

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
        .setColor(HexToNumber(EmbedData.color.none))
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
  method: "getMessage"
    | "getFocused"
    | "getMentionable"
    | "getRole"
    | "getUser"
    | "getMember"
    | "getAttachment"
    | "getNumber"
    | "getInteger"
    | "getString"
    | "getChannel"
    | "getBoolean"
    | "getSubcommandGroup"
    | "getSubcommand",
  optionName?: string,
  fallbackIndex?: number,
  args?: string[]
): T | null {
  if (interaction instanceof CommandInteraction && interaction.options instanceof CommandInteractionOptionResolver)
    // @ts-ignore
    return interaction.options[method](optionName) as T;

  return args && args[fallbackIndex!] ? (args[fallbackIndex!] as unknown as T) : null;
}

export function getChannel(interaction: Respondable, optionName?: string, fallbackIndex?: number, args?: string[]) {
  if (interaction instanceof CommandInteraction && interaction.options instanceof CommandInteractionOptionResolver)
    // @ts-ignore
    interaction.options.getChannel(optionName)

  return args && args[fallbackIndex!] ? (interaction.guild?.channels.cache.get(args[fallbackIndex!] as string) as GuildChannel) : null
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

// Single options
export const
  UserOption = function (required = false, name = "user", description = "کاربر را وارد کنید."): CommandOption {
    return {
      name,
      description,
      type: ApplicationCommandOptionType.User,
      required
    }
  },
  RoleOption = function (required = false, name = "role", description = "رول را وارد کنید."): CommandOption {
    return {
      name,
      description,
      type: ApplicationCommandOptionType.Role,
      required
    };
  },
  ChannelOption = function (required = false, name = "channel", description = "چنل وارد کنید.", channel_types?: ChannelType[]): CommandOption {
    let data: any = {
      name,
      description,
      type: ApplicationCommandOptionType.Channel,
      required
    };
    if (channel_types)
      data.channel_types = channel_types;

    return data;
  },
  HbeOption = function (required = false, name = "hbe", description = "این ابزار روی عمل کنه ممبر ها (یا ربات یا انسان یا همه)"): CommandOption {
    return {
      name,
      description,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Humans",
          value: "humans"
        },
        {
          name: "Bots",
          value: "bots"
        },
        {
          name: "Everyone",
          value: "everyone"
        }
      ],
      required
    };
  },
  TimeOption = function (required = false): CommandOption {
    return {
      name: "time",
      description: "زمان فعال بودن عملگر بر روی کاربر را مشخص کنید.",
      type: ApplicationCommandOptionType.String,
      required
    };
  },
  UnDoOption = function (required = false, name = "undo", description = "انچام خلاف فعالیت."): CommandOption {
    return {
      name,
      description,
      type: ApplicationCommandOptionType.Boolean,
      required
    };
  },
  AllChannelsOption = function (required = false, name = "do-for-channels", description = "اعمال روی همه چنل ها.", custom = false): CommandOption {
    if (custom)
      return {
        name,
        description,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Only NsfwCHs",
            value: "nsfw"
          },
          {
            name: "Only TextCHs",
            value: "text"
          },
          {
            name: "Only VoiceCHs",
            value: "voice"
          },
          {
            name: "All CHs",
            value: "all"
          },
          {
            name: "Only ForumCHs",
            value: "forum"
          }
        ],
        required
      };

    else
      return {
        name,
        description,
        type: ApplicationCommandOptionType.Boolean,
        required
      };
  },
  InputOption = function (required = false, name = "input", description = "موارد مورد نیاز را وارد کنید."): CommandOption {
    return {
      name,
      description,
      type: ApplicationCommandOptionType.String,
      required
    };
  },
  EphemeralOption = function (required = false): CommandOption {
    return {
      name: "ephemeral",
      description: "آیا می‌خواهید این پیام مخفی بماند؟",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "بله",
          value: "true"
        },
        {
          name: "خیر",
          value: "false"
        }
      ],
      required
    };
  },
  ReasonOption = function (required = false, name = "reason", description = "دلیل را ذکر کنید."): CommandOption {
    return {
      name,
      description,
      type: ApplicationCommandOptionType.String,
      required
    };
  };

// Multi options
export const

  // (/)member command
  MemberCmdOptions: CommandOptions = [
    {
      name: "ban",
      description: "بن ممبر از سرور.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "BanMembers"
      ]),
      default_member_permissions: new PermissionsBitField([
        "BanMembers"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        UnDoOption(undefined, undefined, "آن بن کردن."),
        ReasonOption(),
        {
          name: "delete-messages",
          type: ApplicationCommandOptionType.String,
          description: "پیغام های ممبر از چه موقع به بعد پاک شود؟",
          choices: [
            {
              name: "Don't Delete Any",
              value: "0"
            },
            {
              name: "Previous Hour",
              value: "1h"
            },
            {
              name: "Previous 6 Hours",
              value: "6h"
            },
            {
              name: "Previous 12 Hours",
              value: "12h"
            },
            {
              name: "Previous 24 Hours",
              value: "24h"
            },
            {
              name: "Previous 3 Days",
              value: "3d"
            },
            {
              name: "Previous 7 Days",
              value: "7d"
            }
          ],
          required: false
        },
        TimeOption(),
        EphemeralOption()
      ]
    },
    {
      name: "kick",
      description: "اخراج ممبر از سرور.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "KickMembers"
      ]),
      default_member_permissions: new PermissionsBitField([
        "KickMembers"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "timeout",
      description: "قفل ممبر در سرور.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ModerateMembers"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ModerateMembers"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        UnDoOption(undefined, undefined, "آن تایم اوت."),
        ReasonOption(),
        TimeOption(),
        EphemeralOption()
      ]
    },
    {
      name: "infromation",
      type: ApplicationCommandOptionType.Subcommand,
      description: "نمایش اطلاعات کامل ممبر در سرور.",
      options: [
        UserOption(),
        EphemeralOption()
      ]
    },
    {
      name: "clear",
      description: "گرفتن تمامی دسترسی های ممبر.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "nickname",
      description: "تغییر نیک نیم ممبر.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageNicknames"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageNicknames"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        {
          name: "input",
          description: "نیک نیم خود را وارد کنید.",
          type: ApplicationCommandOptionType.String,
          required: false
        },
        ReasonOption(),
        EphemeralOption()
      ]
    }
  ],

  // (/)voice command
  VoiceCmdOptions: CommandOptions = [
    {
      name: "mute",
      description: "بی صدا کردن ممبر در ویس.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "MuteMembers"
      ]),
      default_member_permissions: new PermissionsBitField([
        "MuteMembers"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        UnDoOption(undefined, undefined, "آن میوت کردن."),
        ReasonOption(),
        TimeOption(),
        EphemeralOption()
      ]
    },
    {
      name: "deaf",
      description: "کر کردن ممبر در ویس.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "DeafenMembers"
      ]),
      default_member_permissions: new PermissionsBitField([
        "DeafenMembers"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        UnDoOption(undefined, undefined, "آن دیف کردن."),
        ReasonOption(),
        TimeOption(),
        EphemeralOption()
      ]
    },
    {
      name: "move",
      description: "جا به جایی ممبر از ویس به ویس مدنظر.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "MoveMembers"
      ]),
      default_member_permissions: new PermissionsBitField([
        "MoveMembers"
      ]),
      options: [
        {
          name: "to",
          description: "ویس چنلی را انتخاب کنید.",
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildVoice],
          required: true
        },
        UserOption(),
        RoleOption(),
        HbeOption(),
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "request-to-speak",
      description: "آوردن کاربر به بالای استیج چنل.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "RequestToSpeak"
      ]),
      default_member_permissions: new PermissionsBitField([
        "RequestToSpeak"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        UnDoOption(undefined, undefined, "پایین بردن از استیج."),
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "disconnect",
      description: "دیسی کردن ممبر از ویس چنل.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ModerateMembers"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ModerateMembers"
      ]),
      options: [
        UserOption(),
        RoleOption(),
        HbeOption(),
        ReasonOption(),
        EphemeralOption()
      ]
    }
  ],

  // (/)role command
  RoleCmdOptions: CommandOptions = [
    {
      name: "information",
      description: "نمایش اطلاعات رول.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        RoleOption(true),
        EphemeralOption()
      ]
    },
    {
      name: "create",
      description: "ساخت رول.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      options: [
        {
          name: "name",
          description: "نام رول جدید را وارد کنید.",
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "icon",
          description: "آیکون رول جدید را آپلود کنید.",
          type: ApplicationCommandOptionType.Attachment,
          required: false
        },
        {
          name: "hoist",
          description: "آیا رول قابل نمایش در لیست ممبر ها باشد؟",
          type: ApplicationCommandOptionType.Boolean,
          required: false
        },
        {
          name: "mentionable",
          description: "آیا همه بتوانند رول را منشن کنند؟",
          type: ApplicationCommandOptionType.Boolean,
          required: false
        },
        {
          name: "color",
          description: "رنگ رول جدید را وارد کنید.",
          type: ApplicationCommandOptionType.String,
          required: false
        },
        {
          name: "position",
          description: "بالای چه رول ساخته شود؟ (به شرط بالا بودن رول ربات)",
          type: ApplicationCommandOptionType.Role,
          required: false
        },
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "clone",
      description: "ساخت رول مشابد از رول مشخص.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      options: [
        RoleOption(true),
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "add",
      description: "اضافه کردن رول به ممبر یا ممبر ها.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      options: [
        RoleOption(true),
        RoleOption(undefined, "to-role", "اضافه کردن رول به تمامی کسایی این رول را دارند."),
        HbeOption(undefined, "to-hbe"),
        UserOption(undefined, "to-user"),
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "copy",
      description: "کپی کردن رول های ممبر به ممبر یا ممبر ها.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      options: [
        UserOption(true, "from", "کپی رول های این ممبر."),
        UserOption(undefined, "to-user", "کپی رول های ممبر به این ممبر."),
        RoleOption(undefined, "to-everyone-have", "کپی کردن رول به تمامی کسایی این رول را دارند."),
        HbeOption(undefined, "to-hbe"),
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "delete",
      description: "حذف رول از سرور.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      options: [
        RoleOption(true),
        UnDoOption(undefined, "delete-all-roles", "پاک کردن رول های سرور."),
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "edit",
      description: "ادیت رول.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      options: [
        {
          name: "name",
          description: "نام رول جدید را وارد کنید.",
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "icon",
          description: "آیکون رول جدید را آپلود کنید.",
          type: ApplicationCommandOptionType.Attachment,
          required: false
        },
        {
          name: "hoist",
          description: "آیا رول قابل نمایش در لیست ممبر ها باشد؟",
          type: ApplicationCommandOptionType.Boolean,
          required: false
        },
        {
          name: "mentionable",
          description: "آیا همه بتوانند رول را منشن کنند؟",
          type: ApplicationCommandOptionType.Boolean,
          required: false
        },
        {
          name: "color",
          description: "رنگ رول جدید را وارد کنید.",
          type: ApplicationCommandOptionType.String,
          required: false
        },
        {
          name: "position",
          description: "بالای چه رولی برده شود؟ (به شرط بالا بودن رول ربات).",
          type: ApplicationCommandOptionType.Role,
          required: false
        },
        ReasonOption(),
        EphemeralOption()
      ]
    },
    {
      name: "remove",
      description: "برداشتن رول از ممبر یا ممبر ها.",
      type: ApplicationCommandOptionType.Subcommand,
      default_bot_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      default_member_permissions: new PermissionsBitField([
        "ManageRoles"
      ]),
      options: [
        RoleOption(true),
        UserOption(undefined, "from-user", "حذف رول از ممبر خاص."),
        RoleOption(undefined, "from-everyone-have", "اضافه کردن رول به تمامی کسایی این رول را دارند."),
        HbeOption(undefined, "from-hbe", "حذف رول از ممبر ها (یا ربات یا انسان یا همه)"),
        ReasonOption(),
        EphemeralOption()
      ]
    }
  ],

  // (/)channel command
  ChannelCmdOptions: CommandOptions = [
    {
      name: "create",
      description: "ساخت یک چنل جدید در سرور.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "نام چنل جدید",
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "type", description: "نوع چنل",
          type: ApplicationCommandOptionType.String,
          required: false,
          choices: Object.keys(ChannelType).filter(a => a.includes("Guild")).map(a => ({
            name: a,
            value: a
          }))
        },
        ChannelOption(undefined, "category", "دسته‌بندی چنل", [ChannelType.GuildCategory]),
        {
          name: "nsfw",
          description: "آیا چنل NSFW باشد؟",
          type: ApplicationCommandOptionType.Boolean,
          required: false
        },
        {
          name: "topic",
          description: "تاپیک یا توضیحات چنل (برای چنل های متنی)",
          type: ApplicationCommandOptionType.String,
          required: false
        },
        ReasonOption()
      ]
    },
    {
      name: "slowmode",
      description: "تنظیم slowmode برای یک چنل متنی.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "duration",
          description: "مدت زمان slowmode (ثانیه)",
          type: ApplicationCommandOptionType.Integer,
          required: true
        },
        ChannelOption(undefined, undefined, undefined, [ChannelType.GuildText]),
        AllChannelsOption(),
        ReasonOption()
      ]
    },
    {
      name: "clone",
      description: "کلون کردن یک چنل موجود.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        ChannelOption(true),
        ReasonOption()
      ]
    },
    {
      name: "edit",
      description: "ویرایش تنظیمات یک چنل.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        ChannelOption(false),
        {
          name: "name",
          description: "نام جدید چنل",
          type: ApplicationCommandOptionType.String,
          required: false
        },
        {
          name: "topic",
          description: "موضوع چنل (برای چنل‌های متنی)",
          type: ApplicationCommandOptionType.String,
          required: false
        },
        ChannelOption(undefined, "category", "دسته‌بندی چنل", [ChannelType.GuildCategory]),
        {
          name: "nsfw",
          description: "تنظیم NSFW",
          type: ApplicationCommandOptionType.Boolean,
          required: false
        },
        AllChannelsOption(undefined, "do-for", undefined, true),
        ReasonOption()
      ]
    },
    {
      name: "delete",
      description: "حذف یک چنل از سرور.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        ChannelOption(),
        AllChannelsOption(undefined, "do-for", undefined, true),
        ReasonOption()
      ]
    },
    {
      name: "purge",
      description: "پاکسازی پیام‌ها در یک چنل.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        ChannelOption(),
        {
          name: "amount",
          description: "تعداد پیام‌ها برای پاکسازی",
          type: ApplicationCommandOptionType.Integer,
          required: false
        },
        HbeOption(),
        InputOption(),
        InputOption(undefined, "ids", "آی‌دی‌های جداشده با کاما (برای roles یا users)"),
        AllChannelsOption(),
        {
          name: "type",
          description: "نوع پیام هایی که میخواهید پاک بشوند را انتخاب کنید.",
          type: ApplicationCommandOptionType.String,
          choices: PurgeTypes.map(a => ({ name: a, value: a })),
          required: false
        },
        ReasonOption(undefined, undefined, "دلیل را ذکر کنید. (این بخش در Audit Log ثبت نمیشود.)")
      ]
    },
    {
      name: "lock",
      description: "قفل یا باز کردن چنل برای دسترسی‌ها.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        ChannelOption(),
        AllChannelsOption(undefined, "do-for", undefined, true),
        HbeOption(),
        UnDoOption(false, "action", "قفل یا باز کردن چنل."),
        InputOption(false, "ids", "آی‌دی‌های جداشده با کاما (برای roles یا users)"),
        ReasonOption()
      ]
    }
  ];
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */