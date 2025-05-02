import {
  ActionRowBuilder,
  ApplicationCommandType,
  BanOptions,
  BulkBanOptions,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  Message,
  PermissionsBitField,
  Role
} from "discord.js";
import {
  canManage,
  createConfirmationMessage,
  filterMembers,
  getMember,
  getOption,
  getUser,
  MemberCmdOptions
} from "../../functions/functions";
import { CommandType } from "../../types/interfaces";
import responseError from "../../utils/responseError";
import HexToNumber from "../../functions/HexToNumber";
import EmbedData from "../../storage/embed";
import response from "../../utils/response";
import strToMs from "../../functions/strToMs";
import yesOrNo from "../../utils/yes-or-no";
import config from "../../../config";
import error from "../../utils/error";

const command: CommandType = {
  data: {
    name: "member",
    description: "مدیریت ممبر ها در سرور.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField(["SendMessages", "ViewChannel"]),
    default_bot_permissions: new PermissionsBitField(["SendMessages", "EmbedLinks", "ViewChannel"]),
    options: MemberCmdOptions
  },
  category: "admin",
  aliases: ["mem"],
  cooldown: 10,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      const
        guild = interaction.guild!,
        issuer = interaction.member as GuildMember,
        botMember = await guild.members.fetchMe(),
        subcommand = getOption<string>(interaction, "getSubcommand", undefined, 0, args),
        db = client.db!;

      switch (subcommand) {
        case "ban": {
          const
            user = getUser(interaction, getOption<any>(interaction, "getUser", "user", 1, args)!),
            doFor = getOption<string>(interaction, "getString", "do-for", 2, args),
            unBan = getOption<boolean>(interaction, "getBoolean", "undo", 3, args),
            reason = getOption<string>(interaction, "getString", "reason", 4, args),
            deleteMessages = getOption<string>(interaction, "getString", "delete-messages", 5, args),
            time = getOption<string>(interaction, "getString", "time", 6, args),
            actionText = unBan ? "آن بن" : "بن";

          if (user) {
            const targetMember = guild.members.cache.get(user.id);
            if (!targetMember)
              return await responseError(interaction, "کاربر یافت نشد.");

            if (!canManage(targetMember, issuer, botMember))
              return await responseError(interaction, "نمی‌توانید کاربری را بن کنید که نقشش بالاتر یا مساوی شما یا من است.");

            const
              confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که ${user} را ${actionText} کنید؟`),
              sentMessage = await response(interaction, confirmMsg),
              banData: BanOptions = {};

            if (reason)
              banData.reason = reason;

            if (deleteMessages)
              banData.deleteMessageSeconds = strToMs(deleteMessages)!;

            const timestamp = time ? Math.round((strToMs(time)! + Date.now()) / 1000) : null;
            return await yesOrNo(
              interaction,
              sentMessage!,
              async (btn) => {
                try {
                  const embed = new EmbedBuilder()
                    .setColor(HexToNumber(EmbedData.color.red))
                    .setTimestamp()
                    .setFooter({ text: `ممبر ${actionText} شد!` })
                    .setFields([
                      {
                        name: "👮 ادمین:",
                        value: `**${issuer.user} | \`${issuer.user.username}\` | \`${issuer.user.id}\`**`
                      },
                      {
                        name: `👤 ممبر ${actionText} شده:`,
                        value: `**${user} | \`${user.username}\` | \`${user.id}\`**`
                      }
                    ]);

                  if (banData.reason)
                    embed.addFields({ name: "📝 دلیل:", value: banData.reason });

                  if (time && timestamp && !unBan)
                    embed.addFields({ name: "⏰ زمان بن:", value: `**<t:${timestamp}:D> | <t:${timestamp}:R>**` });

                  if (unBan)
                    await btn.guild?.members.unban(user, banData.reason);

                  else
                    await btn.guild?.members.ban(user, banData);

                  return await btn.editReply({
                    embeds: [embed],
                    components: []
                  });
                } catch (e: any) {
                  return await responseError(btn, `❌ یوزر ${actionText} نشد!\n${e.message}`, undefined, true);
                }
              }
            );
          }

          else if (doFor) {
            const
              actionFor =
                doFor === "everyone"
                  ? "همه"
                  : doFor === "bots"
                    ? "همه ربات‌ها"
                    : "همه انسان‌ها",

              confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که ${actionFor} را ${actionText} کنید؟`),
              sentMessage = await response(interaction, confirmMsg),
              banData: BulkBanOptions = {};

            if (reason)
              banData.reason = reason;

            if (deleteMessages)
              banData.deleteMessageSeconds = strToMs(deleteMessages)!;

            const
              timestamp = time ? Math.round((strToMs(time)! + Date.now()) / 1000) : null,
              members = filterMembers(guild, doFor, issuer, botMember);

            return await yesOrNo(
              interaction,
              sentMessage!,
              async (btn) => {
                try {
                  const embed = new EmbedBuilder()
                    .setColor(HexToNumber(EmbedData.color.red))
                    .setFooter({ text: `✅ ${actionFor} ${actionText} شدند!` })
                    .setFields([
                      {
                        name: "👮 ادمین:",
                        value: `**${issuer.user} | \`${issuer.user.username}\` | \`${issuer.user.id}\`**`
                      }
                    ]);

                  if (unBan)
                    await Promise.all(
                      members.map(async (member) => {
                        await btn.guild?.members.unban(member.user, banData.reason);
                      })
                    );

                  else
                    await btn.guild?.members.bulkBan(members, banData);

                  if (banData.reason)
                    embed.addFields({ name: "📝 دلیل:", value: banData.reason });

                  if (time && timestamp && !unBan)
                    embed.addFields({ name: "⏰ زمان بن:", value: `**<t:${timestamp}:D> | <t:${timestamp}:R>**` });

                  return await btn.editReply({
                    embeds: [embed],
                    components: []
                  });
                } catch (e: any) {
                  return await responseError(btn, `❌ ممبر ها ${actionText} نشدند!\n${e.message}`, undefined, true);
                }
              }
            );
          }

          return;
        }

        case "kick": {
          const
            user = getMember(interaction, getOption<any>(interaction, "getMember", "user", 1, args)!),
            doFor = getOption<string>(interaction, "getString", "do-for", 2, args),
            reason = getOption<string>(interaction, "getString", "reason", 4, args);

          if (user) {
            const targetMember = guild.members.cache.get(user.id);
            if (!targetMember)
              return await responseError(interaction, "کاربر یافت نشد.");

            if (!canManage(targetMember, issuer, botMember))
              return await responseError(interaction, "❌ نمی‌توانید کاربری را کیک کنید که نقشش بالاتر یا مساوی شما یا من است.");

            const
              confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که ${user} را کیک کنید؟`),
              sentMessage = await response(interaction, confirmMsg);

            return await yesOrNo(
              interaction,
              sentMessage!,
              async (btn) => {
                try {
                  const embed = new EmbedBuilder()
                    .setColor(HexToNumber(EmbedData.color.red))
                    .setTimestamp()
                    .setFooter({ text: "✅ ممبر کیک شد!" })
                    .setFields([
                      {
                        name: "👮 ادمین:",
                        value: `**${issuer.user} | \`${issuer.user.username}\` | \`${issuer.user.id}\`**`
                      },
                      {
                        name: "👤 ممبر کیک شده:",
                        value: `**${user} | \`${user.user.username}\` | \`${user.id}\`**`
                      }
                    ]);

                  await btn.guild?.members.kick(user, reason || undefined);
                  if (reason)
                    embed.addFields({ name: "📝 دلیل:", value: reason });

                  return await btn.editReply({
                    embeds: [embed],
                    components: []
                  });
                } catch (e: any) {
                  return await responseError(btn, `❌ یوزر کیک نشد!\n${e.message}`, undefined, true);
                }
              }
            );
          }

          else if (doFor) {
            const
              actionFor =
                doFor === "everyone"
                  ? "همه"
                  : doFor === "bots"
                    ? "همه ربات‌ها"
                    : "همه انسان‌ها",

              confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که ${actionFor} را کیک کنید؟`),
              sentMessage = await response(interaction, confirmMsg),
              members = filterMembers(guild, doFor, issuer, botMember);

            return await yesOrNo(
              interaction,
              sentMessage!,
              async (btn) => {
                try {
                  const embed = new EmbedBuilder()
                    .setColor(HexToNumber(EmbedData.color.red))
                    .setFooter({ text: `✅ ${actionFor} کیک شدند!` })
                    .setFields([
                      {
                        name: "👮 ادمین:",
                        value: `**${issuer.user} | \`${issuer.user.username}\` | \`${issuer.user.id}\`**`
                      }
                    ]);

                  await Promise.all(
                    members.map(async (member) => {
                      await btn.guild?.members.kick(member.user, reason || undefined);
                    })
                  );
                  if (reason)
                    embed.addFields({ name: "📝 دلیل:", value: reason });

                  return await btn.editReply({
                    embeds: [embed],
                    components: []
                  });
                } catch (e: any) {
                  return await responseError(btn, `❌ ممبر ها کیک نشدند!\n${e.message}`, undefined, true);
                }
              }
            );
          }
          return;
        }

        case "timeout": {
          const
            member = getMember(interaction, getOption<any>(interaction, "getMember", "user", 1, args)!),
            doFor = getOption<string>(interaction, "getString", "do-for", 2, args),
            unTimeout = getOption<boolean>(interaction, "getBoolean", "undo", 3, args),
            reason = getOption<string>(interaction, "getString", "reason", 4, args),
            time = getOption<string>(interaction, "getString", "time", 6, args),
            actionText = unTimeout ? "لغو تایم اوت" : "تایم اوت",
            timestamp = time ? Math.round((strToMs(time)! + Date.now()) / 1000) : null;

          if (member) {
            if (!canManage(member, issuer, botMember))
              return await responseError(interaction, "❌ نمی‌توانید کاربری را تایم اوت کنید که نقشش بالاتر یا مساوی شما یا من است.");

            const
              confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که ${member} را ${actionText} کنید؟`),
              sentMessage = await response(interaction, confirmMsg);

            return await yesOrNo(
              interaction,
              sentMessage!,
              async (btn) => {
                try {
                  const embed = new EmbedBuilder()
                    .setColor(HexToNumber(EmbedData.color.red))
                    .setTimestamp()
                    .setFooter({ text: `✅ ممبر ${actionText} شد!` })
                    .setFields([
                      {
                        name: "👮 ادمین:",
                        value: `**${issuer.user} | \`${issuer.user.username}\` | \`${issuer.user.id}\`**`
                      },
                      {
                        name: `👤 ممبر ${actionText} شده:`,
                        value: `**${member} | \`${member.user.username}\` | \`${member.id}\`**`
                      }
                    ]);
                  if (unTimeout)
                    await member.timeout(0, reason || undefined);

                  else
                    await member.timeout(strToMs(time!) || 5 * 60 * 1000, reason || undefined);

                  if (reason)
                    embed.addFields({ name: "📝 دلیل:", value: reason });

                  if (time && timestamp && !unTimeout)
                    embed.addFields({ name: "⏰ زمان تایم اوت:", value: `**<t:${timestamp}:D> | <t:${timestamp}:R>**` });

                  return await btn.editReply({
                    embeds: [embed],
                    components: []
                  });
                } catch (e: any) {
                  return await responseError(btn, `❌ یوزر ${actionText} نشد!\n${e.message}`, undefined, true);
                }
              }
            );
          }

          else if (doFor) {
            const
              actionFor =
                doFor === "everyone"
                  ? "همه"
                  : doFor === "bots"
                    ? "همه ربات‌ها"
                    : "همه انسان‌ها",

              confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که ${actionFor} را ${actionText} کنید؟`),
              sentMessage = await response(interaction, confirmMsg),
              members = filterMembers(guild, doFor, issuer, botMember);

            return await yesOrNo(
              interaction,
              sentMessage!,
              async (btn) => {
                try {
                  const embed = new EmbedBuilder()
                    .setColor(HexToNumber(EmbedData.color.red))
                    .setFooter({ text: `✅ ${actionFor} ${actionText} شدند!` })
                    .setFields([
                      {
                        name: "👮 ادمین:",
                        value: `**${issuer.user} | \`${issuer.user.username}\` | \`${issuer.user.id}\`**`
                      }
                    ]);

                  if (unTimeout)
                    await Promise.all(
                      members.map(async (member) => {
                        await member.timeout(0, reason || undefined);
                      })
                    );

                  else
                    await Promise.all(
                      members.map(async (member) => {
                        await member.timeout(strToMs(time!) || 5 * 60 * 1000, reason || undefined);
                      })
                    );

                  if (reason)
                    embed.addFields({ name: "📝 دلیل:", value: reason });

                  if (time && timestamp && !unTimeout)
                    embed.addFields({ name: "⏰ زمان تایم اوت:", value: `**<t:${timestamp}:D> | <t:${timestamp}:R>**` });

                  return await btn.editReply({
                    embeds: [embed],
                    components: []
                  });
                } catch (e: any) {
                  return await responseError(btn, `❌ ممبر ها ${actionText} نشدند!\n${e.message}`, undefined, true);
                }
              }
            );
          }
          return;
        }

        case "clear": {
          const
            member = getMember(interaction, getOption<any>(interaction, "getMember", "user", 1, args)!),
            doFor = getOption<string>(interaction, "getString", "do-for", 2, args),
            reason = getOption<string>(interaction, "getString", "reason", 3, args),
            getRestrictedRole = async (): Promise<Role> => {
              let restrictedRole = guild.roles.cache.find(r => r.name === "Restricted");
              if (!restrictedRole)
                restrictedRole = await guild.roles.create({
                  name: "Restricted",
                  color: HexToNumber(EmbedData.color.redlight),
                  permissions: new PermissionsBitField(0n), // No Permissions
                  reason: "سیستم محدودیت ممبر"
                });

              return restrictedRole!;
            },
            restrictMember = async (targetMember: GuildMember) => {
              if (!canManage(targetMember, issuer, botMember))
                return await responseError(interaction, "❌ نمی‌توانید کاربری را محدود کنید که نقشش بالاتر یا مساوی شما یا من است.");

              const restrictedRole = await getRestrictedRole();
              await targetMember.roles.set([restrictedRole.id], reason || "بدون دلیل مشخص");
              return true;
            };

          if (member) {
            const
              confirmMsg = createConfirmationMessage(`⚠️ آیا مطمئن هستید میخواهید **${member.user.username}** را کاملا محدود کنید؟`),
              sentMessage = await response(interaction, confirmMsg);

            return await yesOrNo(
              interaction,
              sentMessage!,
              async (btn) => {
                try {
                  await restrictMember(member);
                  const embed = new EmbedBuilder()
                    .setTitle("✅ محدودیت با موفقیت اعمال شد!")
                    .setColor(HexToNumber(EmbedData.color.green))
                    .setThumbnail(member.displayAvatarURL())
                    .addFields(
                      { name: "کاربر", value: `${member} (\`${member.user.tag}\`)`, inline: true },
                      { name: "توسط", value: `${issuer}`, inline: true },
                      { name: "وضعیت", value: "```diff\n- تمام دسترسی ها مسدود شد\n```" }
                    )
                    .setFooter({ text: "Persian Caesar • محدودیت کاربر" });

                  if (reason)
                    embed.addFields({ name: "📝 دلیل", value: reason });

                  return await btn.editReply({ embeds: [embed], components: [] });
                } catch (e: any) {
                  return await responseError(btn, `❌ خطا در اعمال محدودیت:\n\`\`\`${e.message}\`\`\``);
                }
              });
          }

          if (doFor) {
            const
              filterType =
                doFor === "everyone"
                  ? "همه"
                  : doFor === "bots"
                    ? "ربات‌ها"
                    : "انسان‌ها",

              confirmMsg = createConfirmationMessage(`⚠️ آیا میخواهید **${filterType}** را محدود کنید؟\nاین عمل غیرقابل بازگشت است!`),
              sentMessage = await response(interaction, confirmMsg!)

            return await yesOrNo(
              interaction,
              sentMessage!,
              async (btn) => {
                try {
                  const members = filterMembers(guild, doFor, issuer, botMember);
                  if (!members || members.size === 0)
                    return await responseError(btn, "هیچ کاربری یافت نشد!");

                  let successCount = 0;
                  const failedUsers: string[] = [];
                  for (const [, m] of members)
                    try {
                      await restrictMember(m);
                      successCount++;
                    } catch {
                      failedUsers.push(m.user.tag);
                    }

                  const embed = new EmbedBuilder()
                    .setColor(HexToNumber(EmbedData.color.green))
                    .setTitle(`نتایج عملیات گروهی (${filterType})`)
                    .addFields(
                      { name: "موفق", value: `\`\`\`diff\n+ ${successCount} کاربر\`\`\``, inline: true },
                      { name: "ناموفق", value: `\`\`\`diff\n- ${failedUsers.length} کاربر\`\`\``, inline: true }
                    );
                  if (failedUsers.length > 0)
                    embed.addFields({
                      name: "کاربران ناموفق",
                      value: `\`\`\`${failedUsers.slice(0, 5).join("\n")}\`\`\``
                    });
                  await btn.editReply({ embeds: [embed] });
                } catch (e: any) {
                  await responseError(btn, `❌ خطا در عملیات گروهی:\n\`\`\`${e.message}\`\`\``);
                }
              });
          }
          break;
        }

        case "infromation": {
          const
            targetMember = getMember(interaction, getOption<any>(interaction, "getMember", "user", 1, args)!)!,
            infoEmbed = new EmbedBuilder()
              .setTitle("🔍 اطلاعات کاربر")
              .setThumbnail(targetMember.displayAvatarURL({ forceStatic: true, size: 1024 }))
              .setColor(HexToNumber(EmbedData.color.theme))
              .addFields(
                { name: "👤 نام کاربری", value: `**${targetMember.user.username}**`, inline: true },
                { name: "🆔 شناسه", value: `\`${targetMember.id}\``, inline: true },
                { name: "🏷️ تگ", value: `#${targetMember.user.discriminator}`, inline: true },
                { name: "🤖 ربات", value: targetMember.user.bot ? "✅ بله" : "❌ خیر", inline: true },
                { name: "📆 تاریخ ایجاد", value: `<t:${Math.floor(targetMember.user.createdTimestamp / 1000)}:D>`, inline: true },
                { name: "📥 تاریخ ورود به سرور", value: `<t:${Math.floor(targetMember.joinedTimestamp! / 1000)}:D>`, inline: true },
                { name: "📝 نیک نیم", value: targetMember.nickname ? targetMember.nickname : "ندارد", inline: true },
                { name: "🎭 نقش‌ها", value: targetMember.roles.cache.filter(r => r.id !== guild.id).map(r => r.toString()).join(", ") || "ندارد" },
                { name: "🔑 دسترسی‌های سرور", value: `\`\`\`\n${targetMember.permissions.toArray().join("\n")}\n\`\`\`` }
              ),

            buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("show_avatar")
                .setLabel("🖼️ آواتار")
                .setStyle(ButtonStyle.Primary),

              new ButtonBuilder()
                .setCustomId("show_banner")
                .setLabel("🎞️ بنر")
                .setStyle(ButtonStyle.Primary)
            ),
            replyMsg = await response(interaction, { embeds: [infoEmbed], components: [buttonRow] }),
            collector = (replyMsg as Message).createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

          collector.on("collect", async (i) => {
            if (i.customId === "show_avatar")
              return await i.reply({ content: targetMember.displayAvatarURL({ forceStatic: true, size: 2048 }), ephemeral: true });

            else if (i.customId === "show_banner") {
              const bannerURL = targetMember.bannerURL({ forceStatic: true, size: 2048 });
              if (bannerURL)
                return await i.editReply({ content: bannerURL });

              else
                return await responseError(i, undefined, { content: "❌ بنر برای این کاربر تنظیم نشده است!" });

            }
          });
          break;
        }

        case "nickname": {
          const
            targetMember = getMember(interaction, getOption<any>(interaction, "getMember", "user", 1, args)!)!,
            forAll = getOption<boolean>(interaction, "getBoolean", "for-all", 2, args),
            newNickname = getOption<string>(interaction, "getString", "input", 3, args),
            reason = getOption<string>(interaction, "getString", "reason", 4, args);

          if (!newNickname)
            return await responseError(interaction, "❌ لطفاً نیک نیم جدید را وارد کنید.");

          if (!forAll) {
            if (!targetMember) return responseError(interaction, "کاربر یافت نشد.");
            if (!canManage(targetMember, issuer, botMember))
              return responseError(interaction, "❌ نمی‌توانید نیک نیم این کاربر را تغییر دهید (موقعیت نقش شما یا من پایین است).");

            const confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که نیک نیم **${newNickname}** را برای ${targetMember} اعمال کنید؟`);
            const sentMessage = await response(interaction, confirmMsg);
            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              try {
                await targetMember.setNickname(newNickname, reason || undefined);
                const embed = new EmbedBuilder()
                  .setColor(HexToNumber(EmbedData.color.green))
                  .setDescription(`✅ نیک نیم **${newNickname}** با موفقیت برای ${targetMember} اعمال شد!`)
                  .setFooter({ text: `توسط ${issuer.user.username}` });
                return await btn.editReply({ embeds: [embed], components: [] });
              } catch (e: any) {
                return await responseError(btn, `❌ خطا در تغییر نیک نیم:\n${e.message}`, undefined, true);
              }
            });
          }

          else {
            const members = guild.members.cache.filter(m => canManage(m, issuer, botMember));
            if (!members.size)
              return await responseError(interaction, "هیچ کاربری یافت نشد.");

            const
              confirmMsg = createConfirmationMessage(`❓ آیا مطمئن هستید که نیک نیم **${newNickname}** را برای تمامی اعضای قابل تغییر اعمال کنید؟`),
              sentMessage = await response(interaction, confirmMsg);

            return await yesOrNo(interaction, sentMessage!, async (btn) => {
              let successCount = 0;
              const failedUsers: string[] = [];
              await Promise.all(
                members.map(async (member) => {
                  try {
                    await member.setNickname(newNickname, reason || undefined);
                    successCount++;
                  } catch {
                    failedUsers.push(member.user.tag);
                  }
                })
              );
              const embed = new EmbedBuilder()
                .setColor(HexToNumber(EmbedData.color.green))
                .setTitle(`نتایج تغییر نیک نیم برای تمامی اعضا`)
                .addFields(
                  { name: "✅ موفق", value: `\`\`\`diff\n+ ${successCount} کاربر\`\`\``, inline: true },
                  { name: "❌ ناموفق", value: `\`\`\`diff\n- ${failedUsers.length} کاربر\`\`\``, inline: true }
                );
              if (failedUsers.length > 0)
                embed.addFields({
                  name: "کاربران ناموفق",
                  value: `\`\`\`${failedUsers.slice(0, 5).join("\n")}\`\`\``
                });
              return await btn.editReply({ embeds: [embed], components: [] });
            });
          }
        }

        default: {
          if (interaction instanceof Message) {
            const
              prefix = config.discord.prefix,
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
            return await responseError(interaction, "ساب‌کامند نامعتبر است. لطفاً از گزینه‌های موجود استفاده کنید.");

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