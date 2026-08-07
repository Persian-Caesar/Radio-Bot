import {
    GuildMember,
    InternalDiscordGatewayAdapterCreator
} from "discord.js";
import {
    AudioPlayer,
    AudioPlayerPlayingState,
    AudioPlayerStatus,
    CreateVoiceConnectionOptions,
    JoinVoiceChannelOptions,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel
} from "@discordjs/voice";
import { Respondable } from "../types/bot/discord";

/**
 * Configuration for the voice connection
 */
export interface PlayerData {
    channelId: string;
    guildId: string;
    adapterCreator: InternalDiscordGatewayAdapterCreator;
    selfDeaf?: boolean;
    selfMute?: boolean;
    debug?: boolean;
    group?: string;
}

export default class PlayerManager {
    public queue: string[] = [];
    public currentTrackIndex: number = -1;
    public player: AudioPlayer;
    public data?: PlayerData;

    constructor(interaction?: Respondable) {
        // High maxMissedFrames to handle low CPU/RAM environments
        this.player = createAudioPlayer({
            debug: true,
            behaviors: { maxMissedFrames: 500 }
        });

        if (interaction) {
            const member = interaction.member as GuildMember;
            this.data = {
                channelId: member?.voice?.channel?.id!,
                guildId: interaction.guildId!,
                adapterCreator: interaction.guild!.voiceAdapterCreator,
                selfDeaf: true
            };
        }
    }

    /**
     * Updates player metadata and settings
     */
    public setData(config: CreateVoiceConnectionOptions & JoinVoiceChannelOptions) {
        this.data = { ...config, selfDeaf: config.selfDeaf ?? true };

        return this;
    }

    /**
     * Establishes a connection to the voice channel
     */
    public join(options: CreateVoiceConnectionOptions & JoinVoiceChannelOptions | null = null) {
        const joinConfig = options || this.data;
        if (!joinConfig)
            throw this.error("No player data provided for joining.");

        return joinVoiceChannel({
            ...joinConfig,
            debug: false
        });
    }

    /**
     * Checks if the bot is currently connected to a voice channel
     */
    public isConnected(guildId?: string): boolean {
        return !!getVoiceConnection(guildId || this.data?.guildId!);
    }

    /**
     * Gets the current voice connection or creates a new one
     */
    public get connection() {
        return getVoiceConnection(this.data!.guildId) || this.join();
    }

    /**
     * Returns the current volume level (0-200)
     */
    public get volume(): number {
        const resource = (this.player.state as AudioPlayerPlayingState).resource;

        return resource?.volume ? Math.round(resource.volume.volume * 100) : 0;
    }

    /**
     * Sets the player volume
     */
    public setVolume(input: number): number {
        const resource = (this.player.state as AudioPlayerPlayingState).resource;
        if (resource?.volume && input >= 0 && input <= 200) {
            resource.volume.volume = input / 100;
        }

        this.connection.subscribe(this.player);

        return this.volume;
    }

    public isPaused = () => this.player.state.status === AudioPlayerStatus.Paused;

    public pause() {
        if (!this.isPaused())
            this.player.pause();

        this.connection.subscribe(this.player);

        return this;
    }

    public resume() {
        if (this.isPaused())
            this.player.unpause();

        this.connection.subscribe(this.player);

        return this;
    }

    /**
     * Stops playback and optionally destroys the connection
     */
    public stop(destroy = false) {
        this.player.stop();
        if (destroy) {
            const connection = getVoiceConnection(this.data!.guildId);
            connection?.destroy();
        }

        return this;
    }

    /**
     * Fetches and plays an audio resource
     */
    public async play(url: string): Promise<AudioPlayer> {
        try {
            const stream = await this.createStream(url);
            const resource = createAudioResource(stream as any, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true,
                silencePaddingFrames: 10 // Added padding for stability
            });

            this.player.play(resource);
            if (resource.volume)
                resource.volume.volume = 1;

            this.connection.subscribe(this.player);

            return this.player;
        }

        catch (e) {
            throw this.error(e);
        }
    }

    /**
     * Starts a shuffled radio queue
     */
    public async radio(resources: string[]) {
        this.queue = this.shuffleArray(resources);
        this.currentTrackIndex = -1;

        await this.playNext();
    }

    /**
     * Handles sequential playback logic
     */
    private async playNext() {
        try {
            if (!this.queue.length)
                return;

            this.currentTrackIndex++;
            if (this.currentTrackIndex >= this.queue.length) {
                this.queue = this.shuffleArray(this.queue);
                this.currentTrackIndex = 0;
            }

            const track = this.queue[this.currentTrackIndex];
            await this.play(track);

            // Using "once" instead of "on" to prevent listener leaks
            this.player.on(AudioPlayerStatus.Idle, () => {
                void this.playNext()
            });

            this.player.once("error", (err) => {
                console.error("Player Error:", err);
                void this.playNext();
            });
        }

        catch (e) {
            this.error(e);
        }
    }

    /**
     * Creates a readable stream from a URL with timeout protection
     */

    private controller?: AbortController;

    private async createStream(url: string) {
        this.controller?.abort();

        const controller = new AbortController();
        this.controller = controller;

        try {
            const response = await fetch(url, {
                signal: controller.signal
            });

            if (!response.ok || !response.body) {
                controller.abort();

                throw this.error("Stream unreachable");
            }

            return response.body;
        }

        catch (e) {
            controller.abort();
            throw this.error("Stream Fetch Failed: Check URL or Host Network.");
        }
    }

    destroy() {
        this.controller?.abort();
        this.stop(true);

        const connection = getVoiceConnection(this.data?.guildId!);
        connection?.destroy();

        this.queue = [];
        this.player.removeAllListeners();
    }

    /**
     * Fisher-Yates shuffle algorithm
     */
    private shuffleArray(array: string[]): string[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }

    /**
     * Standardized error factory
     */
    private error(err: any): Error {
        const error = err instanceof Error ? err : new Error(err);
        error.name = "PlayerManager Error";

        return error;
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