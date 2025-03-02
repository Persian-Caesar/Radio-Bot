const
    {
        ApplicationCommandType,
        ApplicationCommandOptionType,
        PermissionFlagsBits,
        PermissionsBitField
    } = require("discord.js"),
    radio = require("../../functions/player"),
    radiostation = require("../../storage/radiostation.json"),
    error = require("../../functions/error"),
    response = require("../../functions/response"),
    replaceValues = require("../../functions/replaceValues"),
    selectLanguage = require("../../functions/selectLanguage"),
    config = require("../../../config"),
    defaultLanguage = selectLanguage(config.source.default_language).commands.play,
    ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
    sendError = require("../../functions/sendError"),
    checkPlayerPerms = require("../../functions/checkPlayerPerms"),
    database = require("../../functions/database"),
    chooseRandom = require("../../functions/chooseRandom");

module.exports = {
    data: {
        name: "play",
        description: defaultLanguage.description,
        type: ApplicationCommandType.ChatInput,
        default_member_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
        default_bot_permissions: new PermissionsBitField([
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak
        ]),
        dm_permission: false,
        nsfw: false,
        options: [
            {
                name: "station",
                description: defaultLanguage.options.station,
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
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
    category: "music",
    cooldown: 5,
    aliases: ["p"],
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
                query = interaction.user ? interaction.options.data.find(a => a.name.startsWith("station"))?.value : args.join(" "),
                db = new database(client.db),
                databaseNames = {
                    station: `radioStation.${interaction.guildId}`,
                    panel: `radioPanel.${interaction.guildId}`,
                    language: `language.${interaction.guild.id}`
                },
                lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
                language = selectLanguage(lang).commands.play,
                firstChoice = chooseRandom(
                    Object
                        .keys(radiostation)
                        .filter(a =>
                            a.toLowerCase().startsWith(query?.toLowerCase())
                        )
                );

            if (await db.has(databaseNames.panel))
                if (interaction.channel.id !== (await db.get(databaseNames.panel)).channel)
                    return await sendError({
                        isUpdateNeed: true,
                        interaction,
                        log: replaceValues(language.replies.onlyPanel, {
                            channel: await db.get(databaseNames.panel).channel
                        })
                    });

            if (!query || !firstChoice)
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: replaceValues(language.replies.invalidQuery, {
                        stations: JSON.stringify(Object.keys(radiostation)).toString()
                    })
                });

            // Check perms
            if (await checkPlayerPerms(interaction))
                return;

            // Start to playe
            const player = new radio()
                .setData({
                    guildId: interaction.guildId,
                    channelId: interaction.member.voice.channelId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });

            player.radio(radiostation[firstChoice]);
            db.set(databaseNames.station, firstChoice);
            return response(interaction, {
                content: replaceValues(language.replies.play, {
                    song: firstChoice
                })
            });
        } catch (e) {
            error(e);
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