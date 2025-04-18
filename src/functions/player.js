const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    AudioPlayerStatus,
    AudioPlayer,
    StreamType
} = require("@discordjs/voice");

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
        this.queue = [];
        this.currentTrackIndex = -1;
        this.player = createAudioPlayer({
            debug: true,
            behaviors: {
                maxMissedFrames: 250
            }
        });
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
     * @param {import("@discordjs/voice").CreateVoiceConnectionOptions & import("@discordjs/voice").JoinVoiceChannelOptions} data - The data for voice connection.
     * @param {string} data.channelId - The voice channel ID.
     * @param {string} data.guildId - The guild ID.
     * @param {Object} data.adapterCreator - The adapter creator to join the channel.
     * @param {string} data.group - An optional group identifier for the voice connection.
     * @param {boolean} [data.debug=false] - If true, debug messages will be enabled for the voice connection and its related components.
     * @param {boolean} [data.selfDeaf=true] - Whether the bot should be self-deafened.
     * @param {boolean} [data.selfMute=false] - Whether to join the channel muted.
     */
    setData({ channelId, guildId, adapterCreator, selfDeaf = true, debug = false, group, selfMute = false }) {
        this.data = {
            debug,
            group,
            selfMute,
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
     * 
     * @description Find a voice connection and return it to boolean.
     * @param {string} guildId - The guild ID.
     * @returns {boolean}
     */
    isConnection(guildId) {
        if (getVoiceConnection(guildId))
            return true;

        return false;
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
        return this.player && this.player.state.status === AudioPlayerStatus.Paused;
    }

    /**
     * @description Pauses the audio player if it is playing.
     * @returns {Player} - The current instance of the Player.
     */
    pause() {
        if (this.player && !this.isPaused())
            this.player.pause();

        this.connection.subscribe(this.player);
        return this;
    }

    /**
     * @description Resumes the audio player if it is paused.
     * @returns {Player} - The current instance of the Player.
     */
    resume() {
        if (this.player && this.isPaused())
            this.player.unpause();

        this.connection.subscribe(this.player);
        return this;
    }

    /**
     * @description Stops the audio player and disconnects from the voice channel.
     * @param {boolean} [destroy=false] - Whether to destroy the connection after stopping.
     * @returns {Player} - The current instance of the Player.
     */
    stop(destroy = false) {
        if (this.player)
            this.player.stop();

        if (destroy && this.connection)
            this.connection.destroy();

        return this;
    }

    /**
     * @description Plays a single resource (audio file, stream, etc.) in the voice channel.
     * @param {string} resource - The URL or stream of the audio.
     * @returns {Promise<AudioPlayer>} - The audio player playing the resource.
     */
    async play(resource) {
        try {
            const
                connection = this.connection || this.join(),
                stream = await this.#createStream(resource),
                audio = createAudioResource(stream, {
                    inputType: StreamType.Arbitrary,
                    inlineVolume: true,
                    silencePaddingFrames: 5,
                    debug: true
                });

            this.player.play(audio);
            connection.subscribe(this.player);
            return this.player;
        } catch (e) {
            throw this.#error(e);
        }
    }

    /**
     * @description Plays a list of radio resources in a loop.
     * @param {Array<string>} resources - A list of resource URLs to play.
     * @returns {Promise<void>} - The audio player that is playing the radio.
     */
    async radio(resources) {
        const shuffledLinks = this.#shuffleArray(resources);
        this.queue = shuffledLinks;
        this.currentTrackIndex = -1; // Reset track index
        await this.playNext();
    }

    /**
     * Play the next track from the queue.
     * 
     * @returns {Promise<void>}
     */
    async playNext() {
        try {
            if (!this.queue.length) return;

            this.currentTrackIndex++;
            if (this.currentTrackIndex >= this.queue.length) {
                this.queue = this.#shuffleArray(this.queue);
                this.currentTrackIndex = 0;
            }

            const track = this.queue[this.currentTrackIndex];
            let handled = false;

            await this.play(track);

            const handle = async () => {
                if (handled) return;

                handled = true;
                return await this.playNext();
            };

            this.player.removeAllListeners();
            this.player.on(AudioPlayerStatus.Idle, handle);
            this.player.on("error", handle);
        } catch (error) {
            this.#error(error);
        }
    }

    /**
     * @description Creates a stream from the given URL.
     * @param {string} url - The URL of the audio resource.
     * @returns {Promise<ReadableStream<Uint8Array<ArrayBufferLike>> | null>} - A stream of the audio data.
     */
    async #createStream(url) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(url, { signal: controller.signal }).catch(() => null);
            clearTimeout(timeout);

            if (!response || !response.ok)
                throw this.#error("Failed to fetch stream");

            return response.body;
        } catch (e) {
            throw this.#error(e);
        }
    }

    /**
     * Shuffle an array (radio stations list).
     * 
     * @param {Array<string>} array 
     * @returns {Array<string>}
     */
    #shuffleArray(array) {
        let shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * @description Creates an error object with a custom error message.
     * @param {any} message - Error or The error message.
     * @returns {Error} - The custom error.
     */
    #error(message) {
        class error extends Error {

            /**
             * 
             * @param {any} error 
             */
            constructor(error) {
                super();
                this.name = "Player Error";

                if (error.message) {
                    this.message = error.message;
                    this.stack = error?.stack ?? undefined;
                    this.cause = error?.cause ?? undefined;
                }

                else
                    this.message = error;
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