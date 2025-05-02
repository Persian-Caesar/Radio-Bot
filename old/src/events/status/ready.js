const
    {
        EmbedBuilder,
        ButtonBuilder,
        ActionRowBuilder,
        ButtonStyle
    } = require("discord.js"),
    error = require("../../functions/error"),
    config = require("../../../config"),
    data = require("../../storage/embed"),
    statusEmbedBuilder = require("../../functions/statusEmbedBuilder"),
    database = require("../../functions/database"),
    selectLanguage = require("../../functions/selectLanguage"),
    defaultLanguage = selectLanguage(config.source.default_language),
    replaceValues = require("../../functions/replaceValues");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @returns {void}
 */
module.exports = async (client) => {
    try {
        const
            db = new database(client.db),
            guild = client.guilds.cache.get(config.discord.support.id),
            channel = client.channels.cache.get(config.discord.support.stats_channel),
            databaseName = `status.${channel?.guild?.id}`;

        if (guild && channel) {
            setInterval(async () => {
                const status_message = await db.get(`${databaseName}`);
                let msg;
                try {
                    msg = await channel.messages.fetch(status_message).then((m) => m);
                } catch { };
                const embed = EmbedBuilder.from(await statusEmbedBuilder(client));
                const row = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel(defaultLanguage.replies.status.refresh)
                                .setEmoji(data.emotes.default.update)
                                .setCustomId("refreshStatus")
                        ),

                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel(defaultLanguage.replies.status.invite)
                                .setEmoji(data.emotes.default.invite)
                                .setURL(replaceValues(config.discord.default_invite, { clientId: client.user.id })),

                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel(defaultLanguage.replies.status.vote)
                                .setEmoji(data.emotes.default.topgg)
                                .setURL(`https://top.gg/bot/${client.user.id}/vote`)
                        )
                ];

                if (status_message && msg) {
                    return await msg.edit({
                        embeds: [embed]
                    });
                } else {
                    return await channel.send({
                        embeds: [embed],
                        components: row
                    }).then(async (msg) => {
                        await db.set(`${databaseName}`, msg.id)
                    });
                }
            }, 1000 * 60 * 60);
        };
    } catch (e) {
        error(e)
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