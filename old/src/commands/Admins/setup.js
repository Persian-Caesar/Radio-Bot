const
    {
        ApplicationCommandType,
        ApplicationCommandOptionType,
        ChannelType,
        EmbedBuilder,
        ActionRowBuilder,
        StringSelectMenuBuilder,
        ButtonBuilder,
        ButtonStyle,
        ComponentType,
        PermissionFlagsBits,
        PermissionsBitField
    } = require("discord.js"),
    error = require("../../functions/error"),
    deleteResponse = require("../../functions/deleteResponse"),
    response = require("../../functions/response"),
    sendError = require("../../functions/sendError"),
    copyRight = require("../../storage/embed"),
    config = require("../../../config"),
    selectLanguage = require("../../functions/selectLanguage"),
    ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
    defaultLanguage = selectLanguage(config.source.default_language).commands.setup,
    radiostation = require("../../storage/radiostation.json"),
    languages = require("../../storage/languages.json"),
    chunkArray = require("../../functions/chunkArray"),
    replaceValues = require("../../functions/replaceValues"),
    choices = Object.keys(radiostation).map((a) => JSON.stringify({
        label: `${a}`,
        value: `${a}`
    })).map(a => JSON.parse(a)),
    database = require("../../functions/database"),
    chooseRandom = require("../../functions/chooseRandom");

module.exports = {
    data: {
        name: "setup",
        description: defaultLanguage.description,
        type: ApplicationCommandType.ChatInput,
        default_member_permissions: new PermissionsBitField([
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.SendMessages
        ]),
        default_bot_permissions: new PermissionsBitField([
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
        ]),
        dm_permission: false,
        nsfw: false,
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
                                    name: languages[a],
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
    only_owner: false,
    only_slash: true,
    only_message: true,

    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {Array<string>} args 
     * @returns {void}
     */
    run: async (client, interaction, args) => {
        try {
            const
                db = new database(client.db),
                databaseNames = {
                    panel: `radioPanel.${interaction.guildId}`,
                    prefix: `prefix.${interaction.guildId}`,
                    customCommand: `commands.${interaction.guild.id}`,
                    language: `language.${interaction.guild.id}`
                },
                lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
                language = selectLanguage(lang).commands.setup,
                prefix = (await db.has(databaseNames.prefix)) ? await db.get(databaseNames.prefix) : `${config.discord.prefix}`,
                setup = client.commands.get("setup");

            switch (interaction.user ? interaction.options.getSubcommand() : args[0]) {
                case "panel": {
                    const channel = interaction.user ?
                        interaction.options.getChannel("channel") :
                        interaction.mentions.channels.first() || interaction.guild.channels.cache.get(args[1]);

                    if (!channel && await db.has(databaseNames.panel)) {
                        const radioPanel = await db.get(databaseNames.panel);
                        const message = await sendError({
                            interaction,
                            isUpdateNeed: true,
                            data: {
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(copyRight.color.red)
                                        .setFooter(
                                            {
                                                text: copyRight.footer.footerText,
                                                iconURL: copyRight.footer.footerIcon
                                            }
                                        )
                                        .setTitle(selectLanguage(lang).replies.error)
                                        .setDescription(`${replaceValues(language.subCommands.panel.replies.doDeleteChannel, {
                                            channel: radioPanel.channel
                                        })}`)
                                ],
                                components: [
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId("setup-accept")
                                                .setEmoji("✅")
                                                .setLabel(selectLanguage(lang).replies.buttons.buttonYes)
                                                .setStyle(ButtonStyle.Success),

                                            new ButtonBuilder()
                                                .setCustomId("setup-cancel")
                                                .setEmoji("❌")
                                                .setLabel(selectLanguage(lang).replies.buttons.buttonNo)
                                                .setStyle(ButtonStyle.Secondary)
                                        )
                                ]
                            }
                        });
                        const collector = await message.createMessageComponentCollector({ time: 60 * 1000, componentType: ComponentType.Button });
                        collector.on("collect", async (button) => {
                            if (button.user.id !== interaction.member.id)
                                return await sendError({
                                    interaction: button,
                                    log: replaceValues(selectLanguage(lang).commands.help.replies.invalidUser, {
                                        mention_command: `</${setup.data.name}:${setup.data?.id}>`,
                                        author: interaction.member
                                    })
                                });

                            switch (button.customId) {
                                case "setup-accept": {
                                    await button.deferUpdate();
                                    await db.delete(databaseNames.panel);
                                    return await button.editReply({
                                        content: language.subCommands.panel.replies.deleteChannel,
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
                            return await deleteResponse({ interaction, message: message });
                        });

                        return;
                    }

                    else if (!channel)
                        return await sendError({
                            interaction,
                            isUpdateNeed: true,
                            log: language.subCommands.panel.replies.noChannel
                        })

                    else {
                        const
                            embed = new EmbedBuilder()
                                .setColor(copyRight.color.theme)
                                .setTitle(language.subCommands.panel.replies.panelTitle)
                                .setTimestamp(),

                            components = [];

                        chunkArray(choices, 25)
                            .forEach((array, index) => {
                                components.push(
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new StringSelectMenuBuilder()
                                                .setCustomId(`radioPanel-${++index}`)
                                                .setPlaceholder(language.subCommands.panel.replies.panelMenu)
                                                .setOptions(array)
                                                .setMaxValues(1)
                                        )
                                )
                            });

                        const message = await channel.send({
                            embeds: [embed],
                            components: components
                        });

                        await db.set(databaseNames.panel, { channel: channel.id, message: message.id });
                        return await response(interaction, {
                            content: replaceValues(language.subCommands.panel.replies.success, { channel: channel.id })
                        });
                    }
                    break;
                }

                case "prefix": {
                    const newPrefix = interaction.user ? interaction.options.getString("input") : args[1];
                    if (!newPrefix && await db.has(databaseNames.prefix)) {
                        const lastPrefix = await db.get(databaseNames.prefix);
                        const message = await sendError({
                            interaction,
                            isUpdateNeed: true,
                            data: {
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(copyRight.color.red)
                                        .setFooter(
                                            {
                                                text: copyRight.footer.footerText,
                                                iconURL: copyRight.footer.footerIcon
                                            }
                                        )
                                        .setTitle(selectLanguage(lang).replies.error)
                                        .setDescription(`${replaceValues(language.subCommands.prefix.replies.doDeletePrefix, {
                                            prefix: lastPrefix
                                        })}`)
                                ],
                                components: [
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId("setup-accept")
                                                .setEmoji("✅")
                                                .setLabel(selectLanguage(lang).replies.buttons.buttonYes)
                                                .setStyle(ButtonStyle.Success),

                                            new ButtonBuilder()
                                                .setCustomId("setup-cancel")
                                                .setEmoji("❌")
                                                .setLabel(selectLanguage(lang).replies.buttons.buttonNo)
                                                .setStyle(ButtonStyle.Secondary)
                                        )
                                ]
                            }
                        });
                        const collector = await message.createMessageComponentCollector({ time: 60 * 1000, componentType: ComponentType.Button });
                        collector.on("collect", async (button) => {
                            if (button.user.id !== interaction.member.id)
                                return await sendError({
                                    interaction: button,
                                    log: replaceValues(selectLanguage(lang).commands.help.replies.invalidUser, {
                                        mention_command: `</${setup.data.name}:${setup.data?.id}>`,
                                        author: interaction.member
                                    })
                                });

                            switch (button.customId) {
                                case "setup-accept": {
                                    await button.deferUpdate();
                                    await db.delete(databaseNames.prefix);
                                    return await button.editReply({
                                        content: replaceValues(language.subCommands.prefix.replies.deletePrefix, { prefix: config.discord.prefix }),
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
                            return await deleteResponse({ interaction, message: message });
                        });

                        return;
                    }

                    else if (!newPrefix)
                        return await sendError({
                            interaction,
                            isUpdateNeed: true,
                            log: language.subCommands.prefix.replies.noPrefix
                        })

                    else {
                        await db.set(databaseNames.prefix, newPrefix);
                        return await response(interaction, {
                            content: replaceValues(language.subCommands.prefix.replies.success, { prefix: newPrefix })
                        });
                    }
                    break;
                }

                case "language": {
                    const
                        newlanguage = interaction.user ? interaction.options.getString("input") : args.slice(1).join(" "),
                        firstChoice = chooseRandom(
                            Object.keys(languages)
                                .filter(a =>
                                    a.startsWith(newlanguage) || languages[a].toLowerCase().startsWith(newlanguage?.toLowerCase())
                                )
                        );

                    if (!newlanguage && await db.has(databaseNames.language)) {
                        const lastlanguage = await db.get(databaseNames.language);
                        const message = await sendError({
                            interaction,
                            isUpdateNeed: true,
                            data: {
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(copyRight.color.red)
                                        .setFooter(
                                            {
                                                text: copyRight.footer.footerText,
                                                iconURL: copyRight.footer.footerIcon
                                            }
                                        )
                                        .setTitle(selectLanguage(lang).replies.error)
                                        .setDescription(`${replaceValues(language.subCommands.language.replies.doDeleteLanguage, {
                                            language: lastlanguage
                                        })}`)
                                ],
                                components: [
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId("setup-accept")
                                                .setEmoji("✅")
                                                .setLabel(selectLanguage(lang).replies.buttons.buttonYes)
                                                .setStyle(ButtonStyle.Success),

                                            new ButtonBuilder()
                                                .setCustomId("setup-cancel")
                                                .setEmoji("❌")
                                                .setLabel(selectLanguage(lang).replies.buttons.buttonNo)
                                                .setStyle(ButtonStyle.Secondary)
                                        )
                                ]
                            }
                        });
                        const collector = await message.createMessageComponentCollector({ time: 60 * 1000, componentType: ComponentType.Button });
                        collector.on("collect", async (button) => {
                            if (button.user.id !== interaction.member.id)
                                return await sendError({
                                    interaction: button,
                                    log: replaceValues(selectLanguage(lang).commands.help.replies.invalidUser, {
                                        mention_command: `</${setup.data.name}:${setup.data?.id}>`,
                                        author: interaction.member
                                    })
                                });

                            switch (button.customId) {
                                case "setup-accept": {
                                    await button.deferUpdate();
                                    await db.delete(databaseNames.language);
                                    return await button.editReply({
                                        content: replaceValues(language.subCommands.language.replies.deleteLanguage, { language: config.source.default_language }),
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
                            return await deleteResponse({ interaction, message: message });
                        });

                        return;
                    }

                    else if (!newlanguage || !firstChoice)
                        return await sendError({
                            interaction,
                            isUpdateNeed: true,
                            log: replaceValues(language.subCommands.language.replies.noLanguage, {
                                languages: JSON.stringify(Object.values(languages))
                            })
                        })

                    else {
                        await db.set(databaseNames.language, firstChoice);
                        return await response(interaction, {
                            content: replaceValues(language.subCommands.language.replies.success, { language: languages[firstChoice] })
                        });
                    }
                    break;
                }

                default: {
                    const embed = new EmbedBuilder()
                        .setColor(copyRight.color.theme)
                        .setTitle("Help | Setup")
                        .setDescription(language.description)
                        .setFooter(
                            {
                                text: `Admin Embed • ${copyRight.footer.footerText}`
                            }
                        )
                        .setThumbnail(client.user.displayAvatarURL(
                            {
                                forceStatic: true
                            }
                        ))
                        .setTimestamp();

                    setup.data.options.forEach(a => {
                        embed.addFields(
                            {
                                name: `\`${prefix}setup ${a.name}\`${a.usage ? ` | ${a.usage}` : ""}:`,
                                value: `\`${language.subCommands[a.name].description}\``,
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
        } catch (e) {
            error(e)
        }
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