const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    AudioPlayerStatus,
    AudioPlayer
} = require("@discordjs/voice");

const
    audioPlayer = new Map(),
    audioPlayerData = {
        debug: true,
        behaviors: {
            maxMissedFrames: 250
        }
    },
    audioResourceData = {
        inputType: StreamType.Opus,
        inlineVolume: true,
        silencePaddingFrames: 5,
        debug: true
    };

/**
 * @class Player
 * @description This class handles the connection and playback of audio in a Discord voice channel.
 * 
 * @example
 * ```js
 * // Load class.
 * const player = new Player(interaction);
 * 
 * // Play the url.
 * player.play("url");
 * 
 * // Get connection volume.
 * console.log(player.volume);  // output: <player.volume> like 100
 * 
 * // Set connection volume.
 * console.log(player.setVolume(50)); // output: 50
 * 
 * // Pause the player.
 * if(player.isPaused()) // If it's true it should be resumed.
 *  player.resume();
 * 
 * else
 *  // This one sould be paused.
 *  player.pause();
 * 
 * // Radio mode.
 * player.radio(["url"]);
 * 
 * // Stop the player.
 * player.stop();
 * ```
 */
module.exports = class Player {

    /**
     * @constructor
     * @param {import("discord.js").CommandInteraction} interaction - The interaction to get voice channel info.
     */
    constructor(interaction) {
        if (interaction)
            this.data = {
                channelId: interaction.member.voice?.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true
            };

        return this;
    }

    /**
     * @description Sets the player's data to control the voice channel settings.
     * @param {Object} data - The data for voice connection.
     * @param {string} data.channelId - The voice channel ID.
     * @param {string} data.guildId - The guild ID.
     * @param {Object} data.adapterCreator - The adapter creator to join the channel.
     * @param {boolean} [data.selfDeaf=true] - Whether the bot should be self-deafened.
     */
    setData({ channelId, guildId, adapterCreator, selfDeaf = true }) {
        this.data = {
            channelId,
            guildId,
            adapterCreator,
            selfDeaf
        };
        return this;
    }

    /**
     * @description Joins the voice channel.
     * @param {Object} data - The connection settings.
     * @returns {import("@discordjs/voice").VoiceConnection} - The voice connection.
     */
    join(data = null) {
        if (!data) data = this.data;

        return joinVoiceChannel(data);
    }

    /**
     * @description Retrieves the current voice connection for the guild.
     * @returns {import("@discordjs/voice").VoiceConnection} - The current voice connection.
     */
    get connection() {
        return getVoiceConnection(this.data.guildId);
    }

    /**
     * @description Checks if the player is paused.
     * @returns {boolean} - Whether the player is paused.
     */
    isPaused() {
        const player = audioPlayer.get(this.data.guildId);
        return player && player.state.status === AudioPlayerStatus.Paused;
    }

    /**
     * @description Pauses the audio player if it is playing.
     * @returns {Player} - The current instance of the Player.
     */
    pause() {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (player && !this.isPaused())
            player.pause();

        connection.subscribe(player);
        return this;
    }

    /**
     * @description Resumes the audio player if it is paused.
     * @returns {Player} - The current instance of the Player.
     */
    resume() {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (player && this.isPaused())
            player.unpause();

        connection.subscribe(player);
        return this;
    }

    /**
     * @description Stops the audio player and disconnects from the voice channel.
     * @param {boolean} [destroy=false] - Whether to destroy the connection after stopping.
     * @returns {Player} - The current instance of the Player.
     */
    stop(destroy = false) {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (player)
            player.stop();

        if (destroy && connection)
            connection.destroy();

        audioPlayer.delete(this.data.guildId);
        return this;
    }

    /**
     * @description Plays a single resource (audio file, stream, etc.) in the voice channel.
     * @param {string} resource - The URL or stream of the audio.
     * @returns {Promise<AudioPlayer>} - The audio player playing the resource.
     */
    async play(resource) {
        let attempts = 0;
        const maxAttempts = 2;
        while (attempts < maxAttempts) {
            try {
                const connection = this.join();
                const player = createAudioPlayer(audioPlayerData);
                const audioResource = await this.#createStream(resource);
                player.play(createAudioResource(audioResource, audioResourceData));
                connection.subscribe(player);
                audioPlayer.set(this.data.guildId, player);
                return player;
            } catch (e) {
                attempts++;
                if (attempts === maxAttempts)
                    throw this.#error(e);

            }
        }
    }

    /**
     * @description Plays a list of radio resources in a loop.
     * @param {Array<string>} resources - A list of resource URLs to play.
     * @returns {Promise<AudioPlayer>} - The audio player that is playing the radio.
     */
    async radio(resources) {
        let number = this.#randomNumFromArrayLen(resources);
        const playRadio = async () => {
            this.stop();
            const player = await this.play(resources[number]);
            number++;
            if (number >= resources.length) number = this.#randomNumFromArrayLen(resources);

            return player;
        };

        const player = await playRadio();
        const connection = this.connection;

        // Handle connection errors by restarting the stream.
        connection?.on("error", async () => {
            return await playRadio();
        });

        player?.on("debug", async (e) => {
            const [oldStatus, newStatus] = e.replace("state change:", "").split("\n").map(value => value.replace("from", "").replace("to", "").replaceAll(" ", "")).filter(value => value !== "").map(value => JSON.parse(value));
            if (newStatus.status === "idle") {
                return await playRadio();
            }
        });

        player?.on("error", async () => {
            return await playRadio();
        });

        player?.on("unsubscribe", async () => {
            return await playRadio();
        });

        return player;
    }

    /**
     * @description Creates a stream from the given URL.
     * @param {string} url - The URL of the audio resource.
     * @returns {Promise<stream>} - A stream of the audio data.
     */
    async #createStream(url) {
        try {
            const response = await fetch(url);
            url = response.url;
        } catch {
            url = url;
        }
        return url;
    }

    /**
     * @description Generates a random number from an array length.
     * @param {Array<any>} array - The array to pick a random number from.
     * @returns {number} - A random index from the array.
     */
    #randomNumFromArrayLen(array) {
        return Math.floor(Math.random() * array.length);
    }

    /**
     * @description Creates an error object with a custom error message.
     * @param {string} message - The error message.
     * @returns {Error} - The custom error.
     */
    #error(message) {
        class error extends Error {
            constructor(message) {
                super();
                this.name = "Player";
                this.message = message;
            }
        }
        return new error(message);
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