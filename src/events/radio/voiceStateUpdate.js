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
            databaseNames = {
                afk: `radioAFK.${oldState.guild.id}`,
                station: `radioStation.${oldState.guild.id}`
            },
            channel = await db.get(databaseNames.afk),
            station = await db.get(databaseNames.station) || "Lofi Radio",
            oldHumansInVoiceSize = oldState.channel?.members?.filter(a => !a.user.bot)?.size,
            newHumansInVoiceSize = newState.channel?.members?.filter(a => !a.user.bot)?.size,
            player = new Player()
                .setData(
                    {
                        channelId: channel,
                        guildId: oldState.guild.id,
                        adapterCreator: oldState.guild.voiceAdapterCreator
                    }
                );

        if (oldState.member?.id === client.user?.id && !newState.channelId && channel)
            return await player.join();

        if ((oldHumansInVoiceSize && oldHumansInVoiceSize === 0) && (newHumansInVoiceSize && newHumansInVoiceSize >= 1) && channel)
            return await player.radio(radiostation[station]);

        else
            return await player.stop();

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