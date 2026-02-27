import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  SelectMenuComponentOptionData,
  StringSelectMenuBuilder
} from "discord.js";
import {
  Categoris,
  CommandType
} from "../../types/command/type";
import {
  ErrorCode,
  ErrorDetails
} from "../../types/bot/handle-error";
import { Language } from "../../types/language/type";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/response/responseError";
import responseEdit from "../../utils/response/responseEdit";
import EmbedData from "../../storage/EmbedData";
import dbAccess from "../../database/dbAccess";
import response from "../../utils/response/response";
import logError from "../../utils/logError";
import config from "../../../config";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.help;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "help",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
    ]),
    default_bot_permissions: new PermissionsBitField([
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks
    ]),
    dm_permission: true,
    options: [
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
  category: "misc",
  cooldown: 10,

  run: async (client, interaction) => {
    try {
      const timeout = 1000 * 60 * 2;
      const category = new Map<string, string>();
      const menu_options: SelectMenuComponentOptionData[] = [];
      const guildId = interaction.guildId!;
      const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
      const language = selectLanguage(lang);
      const author = interaction.user;
      const onlyOwner = client.commands.filter(a => a.only_owner);
      const help = client.commands.get("help")!;
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${client.user!!.username} ${language.commands.help.replies.embed.author}`
        })
        .setFooter({
          text: `${language.commands.help.replies.embed.footer} ${author.tag}`,
          iconURL: author.displayAvatarURL({ forceStatic: true })
        })
        .setColor(EmbedData.color.theme.HexToNumber())
        .addFields(
          [
            {
              name: language.commands.help.replies.embed.field1,
              value: language.commands.help.replies.embed.value1.replaceValues({
                username: client.user!!.username,
                emote: EmbedData.emotes.default.multipleMusicalNotes
              }),
              inline: false
            },
            {
              name: language.commands.help.replies.embed.field2,
              value: language.commands.help.replies.embed.value2,
              inline: false
            }
          ]
        )
        .setThumbnail(client.user!.displayAvatarURL({ forceStatic: true }))

      client.commands.filter(a => !a.only_owner).forEach(a => category.set(a.category, a.category));
      if (config.discord.support.owners.some(r => r.includes(author.id)))
        onlyOwner.forEach(a => category.set(a.category, a.category));

      category.forEach((a) => {
        menu_options.push(
          {
            label: `${a.toString().toCapitalize()}`,
            value: `${a.toString()}`,
            emoji: EmbedData.emotes.default[a as "add"]
          }
        );
      });

      const message = (await response(interaction, {
        embeds: [embed],
        components: await components(language, true, false, menu_options),
        withResponse: true
      }))!;

      const collector = message.createMessageComponentCollector({ time: timeout });

      collector.on("collect", async (int) => {
        if (int.user.id !== author.id)
          return await responseError(
            int,
            language.commands.help.replies.invalidUser.replaceValues({
              mention_command: `</${help.data.name}:${help.data?.id}>`,
              author: author.toString()
            }),
            undefined,
            {
              name: "INVALID_USER_INTERACTION",
              code: ErrorCode.INVALID_USER_INTERACTION,
              message: ErrorDetails[ErrorCode.INVALID_USER_INTERACTION]
            }
          );

        if (int.isButton()) {
          if (int.customId === "home_page") {
            int.update({
              embeds: [embed],
              components: message.components
            })
          }
        };

        if (int.isStringSelectMenu()) {
          if (int.customId === "help_menu") {
            await int.deferUpdate({ withResponse: true });
            const
              value = int.values[0],
              string = await helpCommandDescription(client.commands, selectLanguage(lang), value as Categoris),
              embed = new EmbedBuilder()
                .setThumbnail(client.user!.displayAvatarURL({ forceStatic: true }))
                .setAuthor({
                  name: `${client.user!.username} ${language.commands.help.replies.embed.author}`
                })
                .setTitle(`${EmbedData.emotes.default[value as "add"]}| ${value.toCapitalize()} [${client.commands.filter(a => a.category === value).size}]`)
                .setFooter({
                  text: `${language.commands.help.replies.embed.footer} ${author.tag}`,
                  iconURL: author.displayAvatarURL({ forceStatic: true })
                })
                .setColor(EmbedData.color.theme.HexToNumber())
                .setDescription(`${string.length < 1 ? language.commands.help.replies.noCommands : string}`);

            return await int.editReply({
              embeds: [embed],
              components: await components(language, false, false, menu_options.filter(a => a.value !== value))
            });
          }
        }
      });
      collector.on("end", async () => {
        return await responseEdit(interaction, {
          components: await components(language, true, true, menu_options)
        });
      })
      setTimeout(() => {
        return collector.stop();
      }, timeout);

      // Functions
      async function components(language: Language, disableHomePage: boolean, disableMenu: boolean, options: SelectMenuComponentOptionData[]) {
        return [
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel(language.commands.help.replies.buttons.home)
                .setEmoji(EmbedData.emotes.default.home)
                .setDisabled(disableHomePage)
                .setCustomId("home_page")
            ),

          new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("help_menu")
                .setMaxValues(1)
                .setPlaceholder(language.commands.help.replies.menu)
                .setDisabled(disableMenu)
                .addOptions(options)
            )
        ]
      }
      async function helpCommandDescription(
        commands: Collection<string, CommandType>,
        language: Language,
        value: Categoris
      ) {
        const description: string[] = [];
        await Promise.all(
          commands
            .filter(a => a.category === value)
            .map((command) => {
              const string = `**${`</${command.data.name}:${command.data?.id}>`}${command.usage ? command.usage : ""}\n${language.commands.help.replies.description} \`${language.commands[command.data.name as "setup"].description}\`**`;

              if (command.data.options && command.data.options.some(a => a.type === 1))
                command.data.options
                  .forEach((option) => {
                    const string = `**${`</${command.data.name} ${option.name}:${command.data?.id}>`}${command.usage ? command.usage : ""
                      }\n${language.commands.help.replies.description} \`${language.commands[command.data.name as "setup"].subCommands[option.name as "panel"].description}\`**`;

                    description.push(string);
                  });

              else description.push(string);
            })
        );

        return description.join("\n\n");
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