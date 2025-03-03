
const
    {
        joinVoiceChannel,
        createAudioPlayer,
        createAudioResource,
        NoSubscriberBehavior,
        getVoiceConnection
    } = require("@discordjs/voice"),
    chooseRandom = require("./chooseRandom"),
    audioPlayer = new Map(),
    audioPlayerData = {
        behaviors: {
            // maxMissedFrames: Math.round(5000 / 20),
            // noSubscriber: NoSubscriberBehavior.Pause
            noSubscriber: NoSubscriberBehavior.Play
        }
    },
    audioResourceData = {
        inlineVolume: true,
        debug: true
    };

/**
 * @description This is player class can be use play online resource in discord voice channel.
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
     * 
     * @description To use this class with default settings you may to add "interaction" to it.
     * @param {import("discord.js").CommandInteraction} interaction 
     * @returns {Player}
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
     * 
     * @description Set player data's for using the class.
     * @param {import("@discordjs/voice").JoinVoiceChannelOptions & import("@discordjs/voice").CreateVoiceConnectionOptions} param0 
     * @returns {Player}
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
     * 
     * @description Set guild id of player data.
     * @param {string} guildId 
     * @returns {Player}
     */
    setGuildId(guildId) {
        this.data.guildId = guildId;
        return this;
    }

    /**
     * 
     * @description Set adapterCreator of player data.
     * @param {import("discord.js").InternalDiscordGatewayAdapterCreator} adapterCreator 
     * @returns {Player}
     */
    setAdapterCreator(adapterCreator) {
        this.data.adapterCreator = adapterCreator;
        return this;
    }

    /**
     * 
     * @description Set bot deaf in the voice channel.
     * @param {boolean} selfDeaf 
     * @returns {Player}
     */
    setSelfDeaf(selfDeaf) {
        this.data.selfDeaf = selfDeaf;
        return this;
    }

    /**
     * 
     * @description Set voice channel id to join or play something there.
     * @param {string} channelId 
     * @returns {Player}
     */
    setVoiceChannelId(channelId) {
        this.data.channelId = channelId;
        return this;
    }

    /**
     * 
     * @description Start playing resource in the voice.
     * @param {string} resource 
     * @returns {import("@discordjs/voice").AudioPlayer}
     */
    async play(resource) {
        try {
            const connection = this.join();
            const player = createAudioPlayer(audioPlayerData);
            await player.play(
                createAudioResource(await this.#createStream(resource), audioResourceData)
            );
            connection.subscribe(player);
            audioPlayer.set(this.data.guildId, player);
            return player;
        } catch {
            await this.play(resource);
        }
    }

    /**
     * 
     * @description Join to voice channel.
     * @param {string} guildId
     * @returns {import("@discordjs/voice").VoiceConnection}
     */
    join() {
        if (this.isConnection(this.data.guildId))
            return getVoiceConnection(this.data.guildId);

        return joinVoiceChannel(this.data);
    }

    /**
     * 
     * @description Find a voice connection and return it.
     * @returns {import("@discordjs/voice").VoiceConnection}
     */
    get connection() {
        return getVoiceConnection(this.data.guildId);
    }

    /**
     * 
     * @description Find a voice connection and return it to boolean.
     * @param {string} guildId
     * @returns {boolean}
     */
    isConnection(guildId) {
        if (getVoiceConnection(guildId))
            return true;

        return false;
    }

    /**
     * 
     * @description Get player volume numver and return it.
     * @returns {number}
     */
    get volume() {
        const player = audioPlayer.get(this.data.guildId);
        return Number(player.state.resource.volume.volume * 100);
    }

    /**
     * 
     * @description Find a voice connection and return it to boolean.
     * @param {number} input 
     * @returns {number}
     */
    setVolume(input) {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (input <= 200 && input >= 0)
            player.state.resource.volume.volume = input / 100;

        connection.subscribe(player);
        return Number(this.volume);
    }

    /**
     * 
     * @description Check is player paused or not and return boolean.
     * @returns {boolean}
     */
    isPaused() {
        const player = audioPlayer.get(this.data.guildId);
        if (player.state.status === "paused")
            return true;

        else return false;
    }

    /**
     * 
     * @description Pausing the player.
     * @returns {void}
     */
    pause() {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (!this.isPaused())
            player.pause();

        connection.subscribe(player);
        return this;
    }

    /**
     * 
     * @description Resuming the player.
     * @returns {void}
     */
    resume() {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (this.isPaused())
            player.unpause();

        connection.subscribe(player);
        return this;
    }

    /**
     * 
     * @description Stop the player and break the connection.
     * @returns {void}
     */
    stop() {
        const connection = this.connection;
        const player = audioPlayer.get(this.data.guildId);
        if (player)
            player.stop();

        if (connection)
            connection.destroy();

        audioPlayer.delete(this.data.guildId);
        return this;
    }

    /**
     * 
     * @description Radio mode: It's should be play some resources many times as a loop.
     * @param {Array<string>} resources 
     * @returns {import("@discordjs/voice").AudioResource}
     */
    async radio(resources) {
        let number = this.#randomNumFromArrayLen(resources);
        const playRadio = async () => {
            this.stop();
            const player = await this.play(resources[number]);
            number++;
            if (number >= resources.length)
                number = this.#randomNumFromArrayLen(resources);

            return player;
        };
        const player = await playRadio();
        const connection = this.connection;
        connection.on("error", async () => {
            return await playRadio();
        })
        player.on("debug", async (e) => {
            const [oldStatus, newStatus] = e.replace("state change:", "").split("\n").map(value => value.replace("from", "").replace("to", "").replaceAll(" ", "")).filter(value => value !== "").map(value => JSON.parse(value));
            if (newStatus.status === "idle")
                return await playRadio();

        });
        player.on("error", async () => {
            return await playRadio();
        });
        return player;
    }

    /**
     * 
     * @param {string} message 
     * @returns {Error}
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

    /**
     * 
     * @param {any[]} array 
     * @returns {number}
     */
    #randomNumFromArrayLen(array) {
        return Math.floor(Math.random() * array.length);
    }

    /**
     * 
     * @param {string} url 
     * @returns {stream}
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
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */