const
    error = require("../../functions/error"),
    database = require("../../functions/database"),
    radiostation = require("../../storage/radiostation.json"),
    Player = require("../../functions/player");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").VoiceState} oldState 
 * @param {import("discord.js").VoiceState} newState 
 * @returns {void}
 */
module.exports = async (client, oldState, newState) => {
    try {
        const
            db = new database(client.db),
            guildId = oldState?.guild?.id || newState?.guild?.id,
            adapterCreator = oldState?.guild?.voiceAdapterCreator || newState?.guild?.voiceAdapterCreator,
            databaseNames = {
                afk: `radioAFK.${guildId}`,
                station: `radioStation.${guildId}`
            },
            channel = await db.get(databaseNames.afk),
            station = await db.get(databaseNames.station) || "Lofi Radio",
            oldHumansInVoiceSize = oldState.channel?.members?.filter(a => !a.user.bot)?.size || 0,
            newHumansInVoiceSize = newState.channel?.members?.filter(a => !a.user.bot)?.size || 0,
            botDisconnected = oldState.member?.id === client.user.id && !newState.channelId,
            player = new Player()
                .setData({
                    channelId: channel,
                    guildId,
                    debug: true,
                    adapterCreator
                });

        if (!channel) return;

        if (newHumansInVoiceSize === 0 && oldHumansInVoiceSize > 0)
            return player.stop();

        if (oldHumansInVoiceSize === 0 && newHumansInVoiceSize > 0)
            return await player.radio(radiostation[station]);

        if (botDisconnected)
            return player.join();

    } catch (e) {
        error(e);
    }
};
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */