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
  StringSelectMenuBuilder
} from "discord.js";
import {
  ErrorCode,
  ErrorDetails
} from "../../types/bot/handle.error";
import { CommandType } from "../../types/command/type";
import { Languages } from "../../types/language/type";
import responseDelete from "../../utils/responseDelete";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/responseError";
import radiostation from "../../storage/radiostation.json";
import languages from "../../storage/languages.json";
import EmbedData from "../../storage/EmbedData";
import dbAccess from "../../database/dbAccess";
import response from "../../utils/response";
import logError from "../../utils/logError";
import config from "../../../config";

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
        usage: "[channel]",
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
  cooldown: 10,

  run: async (client, interaction) => {
    try {
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang);
      const setup = client.commands.get("setup")!;

      const subcommand = interaction.options.getSubcommand(true);
      switch (subcommand) {
        case "panel": {
          const channel = interaction.options.getChannel("channel", undefined, [ChannelType.GuildText]);

          const radioPanel = await dbAccess.getPanel(guildId);
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
                  }),
                  undefined,
                  {
                    name: "INVALID_USER_INTERACTION",
                    code: ErrorCode.INVALID_USER_INTERACTION,
                    message: ErrorDetails[ErrorCode.INVALID_USER_INTERACTION]
                  }
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
              return await responseDelete(interaction);
            });

            return;
          }

          else if (!channel)
            return await responseError(
              interaction,
              language.commands.setup.subCommands.panel.replies.noChannel,
              undefined,
              {
                name: "MISSING_ARGUMENT",
                code: ErrorCode.MISSING_ARGUMENT,
                message: ErrorDetails[ErrorCode.MISSING_ARGUMENT]
              }
            )

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

        case "language": {
          const newlanguage = interaction.options.getString("input");

          const firstChoice = newlanguage && Object.keys(languages)
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
                  }),
                  undefined,
                  {
                    name: "INVALID_USER_INTERACTION",
                    code: ErrorCode.INVALID_USER_INTERACTION,
                    message: ErrorDetails[ErrorCode.INVALID_USER_INTERACTION]
                  }
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
              return await responseDelete(interaction);
            });

            return;
          }

          else if (!newlanguage || !firstChoice)
            return await responseError(
              interaction,
              language.commands.setup.subCommands.language.replies.noLanguage.replaceValues({
                languages: JSON.stringify(Object.values(languages))
              }),
              undefined,
              {
                name: "MISSING_ARGUMENT",
                code: ErrorCode.MISSING_ARGUMENT,
                message: ErrorDetails[ErrorCode.MISSING_ARGUMENT]
              }
            )

          else {
            await dbAccess.setLanguage(guildId, firstChoice);

            return await response(interaction, {
              content: language.commands.setup.subCommands.language.replies.success.replaceValues({ language: languages[firstChoice as Languages] })
            });
          }
        }
      }
    }

    catch (e) {
      logError(e)
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