const
    error = require("../../functions/error"),
    radiostation = require("../../storage/radiostation.json"),
    database = require("../../functions/database"),
    player = require("../../functions/player");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @returns {void}
 */
module.exports = async (client) => {
    try {
        await Promise.all(
            client.guilds.cache.map(async (guild) => {
                const
                    db = new database(client.db),
                    databaseNames = {
                        afk: `radioAFK.${guild.id}`,
                        station: `radioStation.${guild.id}`
                    },
                    channel = await db.get(databaseNames.afk),
                    station = await db.get(databaseNames.station) || "Lofi Radio";

                if (channel)
                    return await new player()
                        .setData(
                            {
                                channelId: channel,
                                guildId: guild.id,
                                adapterCreator: guild.voiceAdapterCreator
                            }
                        )
                        .radio(radiostation[station]);

            })
        );
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