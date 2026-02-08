import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  PermissionsBitField,
  StringSelectMenuBuilder,
  TextChannel
} from "discord.js";
import {
  getChannel,
  getOption
} from "../../utils/interactionTools";
import { CommandType } from "../../types/interfaces";
import { Languages } from "../../types/types";
import responseDelete from "../../utils/responseDelete";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/responseError";
import radiostation from "../../storage/radiostation.json";
import languages from "../../storage/languages.json";
import EmbedData from "../../storage/EmbedData";
import dbAccess from "../../database/dbAccess";
import response from "../../utils/response";
import config from "../../../config";
import error from "../../utils/error";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.setup;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;
const choices = Object.keys(radiostation)
  .map((a) => (
    {
      label: `${a}`,
      value: `${a}`
    }
  ));

export default {
  data: {
    name: "setup",
    description: "تنظیمات ربات در سرور.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      "SendMessages",
      "ViewChannel"
    ]),
    default_bot_permissions: new PermissionsBitField([
      "SendMessages",
      "ViewChannel",
      "EmbedLinks"
    ]),
    options: [
      {
        name: "panel",
        description: defaultLanguage.subCommands.panel.description,
        type: ApplicationCommandOptionType.Subcommand,
        usage: "[channel | id]",
        options: [
          {
            name: "channel",
            description: defaultLanguage.subCommands.panel.options.channel,
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText],
            required: false
          },
          {
            name: "ephemeral",
            description: ephemeral.description,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: ephemeral.choices.yes,
                value: "true"
              },
              {
                name: ephemeral.choices.no,
                value: "false"
              }
            ],
            required: false
          }
        ]
      },
      {
        name: "prefix",
        description: defaultLanguage.subCommands.prefix.description,
        type: ApplicationCommandOptionType.Subcommand,
        usage: "[string]",
        options: [
          {
            name: "input",
            description: defaultLanguage.subCommands.prefix.options.input,
            type: ApplicationCommandOptionType.String,
            required: false
          },
          {
            name: "ephemeral",
            description: ephemeral.description,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: ephemeral.choices.yes,
                value: "true"
              },
              {
                name: ephemeral.choices.no,
                value: "false"
              }
            ],
            required: false
          }
        ]
      },
      {
        name: "language",
        description: defaultLanguage.subCommands.language.description,
        type: ApplicationCommandOptionType.Subcommand,
        usage: "[string]",
        options: [
          {
            name: "input",
            description: defaultLanguage.subCommands.language.options.input,
            type: ApplicationCommandOptionType.String,
            choices: Object
              .keys(languages)
              .map(a =>
                JSON.stringify({
                  name: languages[a as Languages],
                  value: a
                })
              )
              .map(a => JSON.parse(a)),

            required: false
          },
          {
            name: "ephemeral",
            description: ephemeral.description,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: ephemeral.choices.yes,
                value: "true"
              },
              {
                name: ephemeral.choices.no,
                value: "false"
              }
            ],
            required: false
          }
        ]
      }
    ]
  },
  category: "admin",
  aliases: ["set", "st"],
  cooldown: 10,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      const db = client.db!;
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang);
      const prefix = (await dbAccess.getPrefix(guildId)) || `${config.discord.prefix}`;
      const setup = client.commands.get("setup")!;

      const subcommand = getOption<string>(interaction, "getSubcommand", undefined, 0, args);
      switch (subcommand) {
        case "panel": {
          const channel = getChannel<TextChannel>(interaction, "channel", 1, args);

          const radioPanel = (await dbAccess.getPanel(guildId));
          if (!channel && radioPanel) {
            const message = await response(interaction, {
              embeds: [
                new EmbedBuilder()
                  .setColor(EmbedData.color.red.HexToNumber())
                  .setFooter(
                    {
                      text: EmbedData.footer.footerText,
                      iconURL: EmbedData.footer.footerIcon
                    }
                  )
                  .setTitle(language.replies.error)
                  .setDescription(`${language.commands.setup.subCommands.panel.replies.doDeleteChannel.replaceValues({
                    channel: radioPanel.channel
                  })}`)
              ],
              components: [
                new ActionRowBuilder<ButtonBuilder>()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId("setup-accept")
                      .setEmoji("✅")
                      .setLabel(language.replies.buttons.buttonYes)
                      .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                      .setCustomId("setup-cancel")
                      .setEmoji("❌")
                      .setLabel(language.replies.buttons.buttonNo)
                      .setStyle(ButtonStyle.Secondary)
                  )
              ]
            });

            const collector = message!.createMessageComponentCollector({ time: 60 * 1000, componentType: ComponentType.Button });
            collector.on("collect", async (button) => {
              if (button.user.id !== interaction.member!.user.id)
                return await responseError(
                  button,
                  language.commands.help.replies.invalidUser.replaceValues({
                    mention_command: `</${setup.data.name}:${setup.data?.id}>`,
                    author: interaction.member?.toString()!
                  })
                );

              switch (button.customId) {
                case "setup-accept": {
                  await button.deferUpdate();
                  await dbAccess.deletePanel(guildId);
                  return await button.editReply({
                    content: language.commands.setup.subCommands.panel.replies.deleteChannel,
                    embeds: [],
                    components: []
                  });
                };
                case "setup-cancel": {
                  collector.stop();
                };
              }
            });
            collector.on("end", async () => {
              return await responseDelete(interaction, message);
            });

            return;
          }

          else if (!channel)
            return await responseError(interaction, language.commands.setup.subCommands.panel.replies.noChannel)

          else {
            const
              embed = new EmbedBuilder()
                .setColor(EmbedData.color.theme.HexToNumber())
                .setTitle(language.commands.setup.subCommands.panel.replies.panelTitle)
                .setTimestamp(),

              components: ActionRowBuilder<StringSelectMenuBuilder>[] = [];

            choices.chunk(25)
              .forEach((array, index) => {
                components.push(
                  new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                      new StringSelectMenuBuilder()
                        .setCustomId(`radioPanel-${index + 1}`)
                        .setPlaceholder(language.commands.setup.subCommands.panel.replies.panelMenu)
                        .setOptions(array)
                        .setMaxValues(1)
                    )
                )
              });

            const message = await channel.send({
              embeds: [embed],
              components: components
            });

            await dbAccess.setPanel(guildId,
              { channel: channel.id, message: message.id }
            );

            return await response(interaction, {
              content: language.commands.setup.subCommands.panel.replies.success.replaceValues({ channel: channel.id })
            });
          }
        }

        case "prefix": {
          const newPrefix = getOption<string>(interaction, "getString", "input", 1, args);
          const lastPrefix = await dbAccess.getPrefix(guildId);
          if (!newPrefix && lastPrefix) {
            const message = await response(interaction, {
              embeds: [
                new EmbedBuilder()
                  .setColor(EmbedData.color.red.HexToNumber())
                  .setFooter(
                    {
                      text: EmbedData.footer.footerText,
                      iconURL: EmbedData.footer.footerIcon
                    }
                  )
                  .setTitle(language.replies.error)
                  .setDescription(`${language.commands.setup.subCommands.prefix.replies.doDeletePrefix.replaceValues({
                    prefix: lastPrefix
                  })}`)
              ],
              components: [
                new ActionRowBuilder<ButtonBuilder>()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId("setup-accept")
                      .setEmoji("✅")
                      .setLabel(language.replies.buttons.buttonYes)
                      .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                      .setCustomId("setup-cancel")
                      .setEmoji("❌")
                      .setLabel(language.replies.buttons.buttonNo)
                      .setStyle(ButtonStyle.Secondary)
                  )
              ]
            });
            const collector = message!.createMessageComponentCollector({ time: 60 * 1000, componentType: ComponentType.Button });
            collector.on("collect", async (button) => {
              if (button.user.id !== interaction.member!.user.id)
                return await responseError(
                  button,
                  language.commands.help.replies.invalidUser.replaceValues({
                    mention_command: `</${setup.data.name}:${setup.data?.id}>`,
                    author: interaction.member?.toString()!
                  })
                );

              switch (button.customId) {
                case "setup-accept": {
                  await button.deferUpdate();
                  await dbAccess.deletePrefix(guildId);
                  return await button.editReply({
                    content: language.commands.setup.subCommands.prefix.replies.deletePrefix.replaceValues({ prefix: config.discord.prefix }),
                    embeds: [],
                    components: []
                  });
                };
                case "setup-cancel": {
                  collector.stop();
                };
              }
            });
            collector.on("end", async () => {
              return await responseDelete(interaction, message);
            });

            return;
          }

          else if (!newPrefix)
            return await responseError(
              interaction,
              language.commands.setup.subCommands.prefix.replies.noPrefix
            )

          else {
            await dbAccess.setPrefix(guildId, newPrefix);

            return await response(interaction, {
              content: language.commands.setup.subCommands.prefix.replies.success.replaceValues({ prefix: newPrefix })
            });
          }
        }

        case "language": {
          const
            newlanguage = getOption<string>(interaction, "getString", "input") || args!.slice(1).join(" "),
            firstChoice = Object.keys(languages)
              .filter(a =>
                a.startsWith(newlanguage) || languages[a as Languages].toLowerCase().startsWith(newlanguage?.toLowerCase())
              ).random();

          const lastlanguage = await dbAccess.getLanguage(guildId);
          if (!newlanguage && lastlanguage) {
            const message = await response(interaction, {
              embeds: [
                new EmbedBuilder()
                  .setColor(EmbedData.color.red.HexToNumber())
                  .setFooter(
                    {
                      text: EmbedData.footer.footerText,
                      iconURL: EmbedData.footer.footerIcon
                    }
                  )
                  .setTitle(language.replies.error)
                  .setDescription(`${language.commands.setup.subCommands.language.replies.doDeleteLanguage.replaceValues({
                    language: lastlanguage
                  })}`)
              ],
              components: [
                new ActionRowBuilder<ButtonBuilder>()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId("setup-accept")
                      .setEmoji("✅")
                      .setLabel(language.replies.buttons.buttonYes)
                      .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                      .setCustomId("setup-cancel")
                      .setEmoji("❌")
                      .setLabel(language.replies.buttons.buttonNo)
                      .setStyle(ButtonStyle.Secondary)
                  )
              ]
            });
            const collector = message!.createMessageComponentCollector({ time: 60 * 1000, componentType: ComponentType.Button });
            collector.on("collect", async (button) => {
              if (button.user.id !== interaction.member!.user.id)
                return await responseError(
                  button,
                  language.commands.help.replies.invalidUser.replaceValues({
                    mention_command: `</${setup.data.name}:${setup.data?.id}>`,
                    author: interaction.member?.toString()!
                  })
                );

              switch (button.customId) {
                case "setup-accept": {
                  await button.deferUpdate();
                  await dbAccess.deleteLanguage(guildId);
                  return await button.editReply({
                    content: language.commands.setup.subCommands.language.replies.deleteLanguage.replaceValues({ language: config.discord.default_language }),
                    embeds: [],
                    components: []
                  });
                };
                case "setup-cancel": {
                  collector.stop();
                };
              }
            });
            collector.on("end", async () => {
              return await responseDelete(interaction, message);
            });

            return;
          }

          else if (!newlanguage || !firstChoice)
            return await responseError(
              interaction,
              language.commands.setup.subCommands.language.replies.noLanguage.replaceValues({
                languages: JSON.stringify(Object.values(languages))
              })
            )

          else {
            await dbAccess.setLanguage(guildId, firstChoice);

            return await response(interaction, {
              content: language.commands.setup.subCommands.language.replies.success.replaceValues({ language: languages[firstChoice as Languages] })
            });
          }
        }

        default: {
          const embed = new EmbedBuilder()
            .setColor(EmbedData.color.theme.HexToNumber())
            .setTitle("Help | Setup")
            .setDescription(language.commands.setup.description)
            .setFooter(
              {
                text: `Admin Embed • ${EmbedData.footer.footerText}`
              }
            )
            .setThumbnail(client.user!.displayAvatarURL(
              {
                forceStatic: true
              }
            ))
            .setTimestamp();

          setup.data.options!.forEach(a => {
            embed.addFields(
              {
                name: `\`${prefix}setup ${a.name}\`${a.usage ? ` | ${a.usage}` : ""}:`,
                value: `\`${language.commands.setup.subCommands[a.name as "panel"].description}\``,
                inline: true
              }
            )
          });
          return await response(interaction,
            {
              embeds: [embed]
            }
          )
        }
      }
    }

    catch (e) {
      error(e)
    }
  }
} as CommandType;

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */