import {
  ApplicationCommandType,
  EmbedBuilder,
  GuildMember,
  Message,
  PermissionsBitField,
  VoiceChannel
} from "discord.js";
import {
  createConfirmationMessage,
  getOption,
  getUser,
  VoiceCmdOptions
} from "../../functions/functions";
import { CommandType } from "../../types/interfaces";
import responseError from "../../utils/responseError";
import HexToNumber from "../../functions/HexToNumber";
import EmbedData from "../../storage/embed";
import response from "../../utils/response";
import yesOrNo from "../../utils/yes-or-no";
import config from "../../../config";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "voice",
    description: "مدیریت دستورات ویس در سرور.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField(["Connect", "Speak"]),
    default_bot_permissions: new PermissionsBitField(["Connect", "Speak", "MoveMembers"]),
    options: VoiceCmdOptions
  },
  category: "admin",
  aliases: ["vc"],
  cooldown: 10,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      if (!interaction.guild) return;
      const guild = interaction.guild,
        issuer = interaction.member as GuildMember,
        botMember = await guild.members.fetchMe(),
        canManage = (target: GuildMember): boolean => {
          return issuer.roles.highest.position > target.roles.highest.position &&
            botMember.roles.highest.position > target.roles.highest.position;
        },
        subcommand = getOption<string>(interaction, "getSubcommand", undefined, 0, args)

      switch (subcommand) {
        case "mute": {
          const user = getUser(interaction, getOption<any>(interaction, "getUser", "user", 1, args)!),
            doFor = getOption<string>(interaction, "getString", "do-for", 2, args);

          if (user) {
            const targetMember = guild.members.cache.get(user.id);
            if (!targetMember)
              return await responseError(interaction, "❌ کاربر یافت نشد.");

            if (!targetMember.voice.channel)
              return await responseError(interaction, "❌ این کاربر در هیچ چنل ویسی حضور ندارد.");

            if (!canManage(targetMember))
              return await responseError(interaction, "❌ نمی‌توانید کاربری را میوت کنید که نقشش بالاتر یا مساوی شما یا من است.");

            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که **${user.username}** را از ویس میوت کنید؟`);
            const sentMessage = await response(interaction, confirmMsg);

            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await targetMember.voice.setMute(true, "دستور میوت توسط مدیر");
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.red))
                  .setTimestamp()
                  .setFooter({ text: "✅ کاربر میوت شد!" })
                  .setFields([
                    { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` },
                    { name: "👤 کاربر میوت شده:", value: `**${user.username} (\`${user.id}\`)**` }
                  ]);

                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ عملیات میوت انجام نشد!\n${e.message}`, undefined, true);
              }
            });
          }
          // حالت گروهی: اگر doFor تعریف شده باشد
          else if (doFor) {
            // فیلتر اعضایی که در چنل ویس حضور دارند
            const members = guild.members.cache.filter(m =>
              m.voice.channel &&
              (doFor === "everyone" ||
                (doFor === "bots" && m.user.bot) ||
                (doFor === "humans" && !m.user.bot))
            );
            if (members.size === 0)
              return await responseError(interaction, "❌ هیچ کاربری در ویس یافت نشد.");

            const actionFor =
              doFor === "everyone" ? "همه" :
                doFor === "bots" ? "همه ربات‌ها" : "همه انسان‌ها";
            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که **${actionFor}** را میوت کنید؟`);
            const sentMessage = await response(interaction, confirmMsg);

            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await Promise.all(
                  members.map(async (member) => {
                    if (canManage(member))
                      await member.voice.setMute(true, "دستور میوت گروهی توسط مدیر");
                  })
                );
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.red))
                  .setFooter({ text: `✅ ${actionFor} میوت شدند!` })
                  .setFields([
                    { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` }
                  ]);
                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ عملیات میوت گروهی انجام نشد!\n${e.message}`, undefined, true);
              }
            });
          } else {
            return await responseError(interaction, "❌ لطفاً یک کاربر مشخص کنید یا گزینه do-for را وارد نمایید.");
          }
        }

        case "deaf": {
          const user = getUser(interaction, getOption<any>(interaction, "getUser", "user", 1, args)!),
            doFor = getOption<string>(interaction, "getString", "do-for", 2, args);
          if (user) {
            const targetMember = guild.members.cache.get(user.id);
            if (!targetMember)
              return await responseError(interaction, "❌ کاربر یافت نشد.");
            if (!targetMember.voice.channel)
              return await responseError(interaction, "❌ این کاربر در هیچ چنل ویسی حضور ندارد.");
            if (!canManage(targetMember))
              return await responseError(interaction, "❌ نمی‌توانید کاربری را کر کنید که نقشش بالاتر یا مساوی شما یا من است.");

            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که **${user.username}** را از ویس کر کنید؟`);
            const sentMessage = await response(interaction, confirmMsg);
            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await targetMember.voice.setDeaf(true, "دستور کر توسط مدیر");
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.red))
                  .setTimestamp()
                  .setFooter({ text: "✅ کاربر کر شد!" })
                  .setFields([
                    { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` },
                    { name: "👤 کاربر کر شده:", value: `**${user.username} (\`${user.id}\`)**` }
                  ]);
                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ عملیات کر انجام نشد!\n${e.message}`, undefined, true);
              }
            });
          }
          else if (doFor) {
            const members = guild.members.cache.filter(m =>
              m.voice.channel &&
              (doFor === "everyone" ||
                (doFor === "bots" && m.user.bot) ||
                (doFor === "humans" && !m.user.bot))
            );
            if (members.size === 0)
              return await responseError(interaction, "❌ هیچ کاربری در ویس یافت نشد.");

            const actionFor =
              doFor === "everyone" ? "همه" :
                doFor === "bots" ? "همه ربات‌ها" : "همه انسان‌ها";
            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که **${actionFor}** را کر کنید؟`);
            const sentMessage = await response(interaction, confirmMsg);

            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await Promise.all(
                  members.map(async (member) => {
                    if (canManage(member))
                      await member.voice.setDeaf(true, "دستور کر گروهی توسط مدیر");
                  })
                );
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.red))
                  .setFooter({ text: `✅ ${actionFor} کر شدند!` })
                  .setFields([
                    { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` }
                  ]);
                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ عملیات کر گروهی انجام نشد!\n${e.message}`, undefined, true);
              }
            });
          } else {
            return await responseError(interaction, "❌ لطفاً یک کاربر مشخص کنید یا گزینه do-for را وارد نمایید.");
          }
        }

        case "move": {
          const
            user = getUser(interaction, getOption<any>(interaction, "getUser", "user", 1, args)!),
            targetChannel = getOption<VoiceChannel>(interaction, "getChannel", "to", 2, args) as VoiceChannel,
            doFor = getOption<string>(interaction, "getString", "do-for", 3, args);

          if (user) {
            const targetMember = guild.members.cache.get(user.id);
            if (!targetMember)
              return await responseError(interaction, "❌ کاربر یافت نشد.");

            if (!targetMember.voice.channel)
              return await responseError(interaction, "❌ این کاربر در هیچ چنل ویسی حضور ندارد.");

            if (!canManage(targetMember))
              return await responseError(interaction, "❌ نمی‌توانید کاربری را جابه‌جا کنید که نقشش بالاتر یا مساوی شما یا من است.");

            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که **${user.username}** را به چنل **${targetChannel.name}** منتقل کنید؟`);
            const sentMessage = await response(interaction, confirmMsg);
            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await targetMember.voice.setChannel(targetChannel, "دستور جابه‌جایی توسط مدیر");
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.red))
                  .setTimestamp()
                  .setFooter({ text: "✅ کاربر منتقل شد!" })
                  .setFields([
                    { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` },
                    { name: "👤 کاربر منتقل شده:", value: `**${user.username} (\`${user.id}\`)**` },
                    { name: "📢 چنل مقصد:", value: `**${targetChannel.name}**` }
                  ]);
                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ عملیات جابه‌جایی انجام نشد!\n${e.message}`, undefined, true);
              }
            });
          }

          else if (doFor) {
            const members = guild.members.cache.filter(m =>
              m.voice.channel &&
              (doFor === "everyone" ||
                (doFor === "bots" && m.user.bot) ||
                (doFor === "humans" && !m.user.bot))
            );
            if (members.size === 0)
              return await responseError(interaction, "❌ هیچ کاربری در ویس یافت نشد.");
            const actionFor =
              doFor === "everyone" ? "همه" :
                doFor === "bots" ? "همه ربات‌ها" : "همه انسان‌ها";
            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که ${actionFor} را به چنل **${targetChannel.name}** منتقل کنید؟`);
            const sentMessage = await response(interaction, confirmMsg);
            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await Promise.all(
                  members.map(async (member) => {
                    if (canManage(member))
                      await member.voice.setChannel(targetChannel, "دستور جابه‌جایی گروهی توسط مدیر");
                  })
                );
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.red))
                  .setFooter({ text: `✅ ${actionFor} منتقل شدند!` })
                  .setFields([
                    { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` },
                    { name: "📢 چنل مقصد:", value: `**${targetChannel.name}**` }
                  ]);
                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ عملیات جابه‌جایی گروهی انجام نشد!\n${e.message}`, undefined, true);
              }
            });
          } else {
            return await responseError(interaction, "❌ لطفاً کاربر یا گزینه do-for را وارد نمایید.");
          }
        }

        case "request-to-speak": {
          const user = getUser(interaction, getOption<any>(interaction, "getUser", "user", 1, args)!);
          if (!user)
            return await responseError(interaction, "❌ لطفاً یک کاربر مشخص کنید.");

          const targetMember = guild.members.cache.get(user.id);
          if (!targetMember)
            return await responseError(interaction, "❌ کاربر یافت نشد.");

          if (!targetMember.voice.channel || targetMember.voice.channel.type !== 13)
            return await responseError(interaction, "❌ کاربر در یک استیج چنل حضور ندارد.");

          if (!canManage(targetMember))
            return await responseError(interaction, "❌ نمی‌توانید برای کاربری درخواست صحبت ارسال کنید که نقشش بالاتر یا مساوی شما یا من است.");

          const
            confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که درخواست صحبت برای **${user.username}** ارسال شود؟`),
            sentMessage = await response(interaction, confirmMsg);

          return await yesOrNo(interaction, sentMessage!, async (btn) => {
            try {
              await targetMember.voice.setRequestToSpeak(true);
              const embed = new EmbedBuilder()
                .setColor(HexToNumber(EmbedData.color.red))
                .setTimestamp()
                .setFooter({ text: "✅ درخواست صحبت ارسال شد!" })
                .setFields([
                  { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` },
                  { name: "👤 کاربر:", value: `**${user.username} (\`${user.id}\`)**` }
                ]);
              return await btn.editReply({ embeds: [embed], components: [] });
            } catch (e: any) {
              return await responseError(btn, `❌ درخواست صحبت ارسال نشد!\n${e.message}`, undefined, true);
            }
          });
        }

        case "disconnect": {
          const
            user = getUser(interaction, getOption<any>(interaction, "getUser", "user", 1, args)!),
            doFor = getOption<string>(interaction, "getString", "do-for", 2, args);

          if (user) {
            const targetMember = guild.members.cache.get(user.id);
            if (!targetMember)
              return await responseError(interaction, "❌ کاربر یافت نشد.");
            if (!targetMember.voice.channel)
              return await responseError(interaction, "❌ کاربر در هیچ چنل ویسی حضور ندارد.");
            if (!canManage(targetMember))
              return await responseError(interaction, "❌ نمی‌توانید کاربری را قطع کنید که نقشش بالاتر یا مساوی شما یا من است.");

            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که **${user.username}** از ویس قطع شود؟`);
            const sentMessage = await response(interaction, confirmMsg);
            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await targetMember.voice.setChannel(null, "دستور قطع ارتباط توسط مدیر");
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.red))
                  .setTimestamp()
                  .setFooter({ text: "✅ کاربر از ویس قطع شد!" })
                  .setFields([
                    { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` },
                    { name: "👤 کاربر:", value: `**${user.username} (\`${user.id}\`)**` }
                  ]);
                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ عملیات قطع ارتباط انجام نشد!\n${e.message}`, undefined, true);
              }
            });
          }

          else if (doFor) {
            const members = guild.members.cache.filter(m =>
              m.voice.channel &&
              (doFor === "everyone" ||
                (doFor === "bots" && m.user.bot) ||
                (doFor === "humans" && !m.user.bot))
            );
            if (members.size === 0)
              return await responseError(interaction, "❌ هیچ کاربری در ویس یافت نشد.");
            const actionFor =
              doFor === "everyone" ? "همه" :
                doFor === "bots" ? "همه ربات‌ها" : "همه انسان‌ها";
            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که ${actionFor} از ویس قطع شوند؟`);
            const sentMessage = await response(interaction, confirmMsg);
            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await Promise.all(
                  members.map(async (member) => {
                    if (canManage(member))
                      await member.voice.setChannel(null, "دستور قطع ارتباط گروهی توسط مدیر");
                  })
                );
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.red))
                  .setFooter({ text: `✅ ${actionFor} از ویس قطع شدند!` })
                  .setFields([
                    { name: "👮 ادمین:", value: `**${issuer.user.tag} (\`${issuer.user.id}\`)**` }
                  ]);
                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ عملیات قطع ارتباط گروهی انجام نشد!\n${e.message}`, undefined, true);
              }
            });
          }

          else
            return await responseError(interaction, "❌ لطفاً یک کاربر مشخص کنید یا گزینه do-for را وارد نمایید.");

        }

        default: {
          if (interaction instanceof Message) {
            const prefix = config.discord.prefix,
              embed = new EmbedBuilder()
                .setTitle(`📋 لیست ساب‌کامندهای ${prefix}${command.data.name}`)
                .setColor(HexToNumber(EmbedData.color.theme))
                .setDescription("لطفاً یکی از ساب‌کامندهای زیر را انتخاب کنید:")
                .setFooter({ text: "برای استفاده از هر ساب‌کامند، دستور مورد نظر را وارد کنید." });

            command.data.options!.forEach(cmd => {
              embed.addFields({ name: cmd.name, value: cmd.description });
            });
            return await response(interaction, { embeds: [embed], ephemeral: true });
          }

          else
            return await responseError(interaction, "❌ ساب‌کامند نامعتبر است. لطفاً از گزینه‌های موجود استفاده کنید.");

        }
      }
    } catch (e: any) {
      error(e);
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