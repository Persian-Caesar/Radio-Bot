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
import logError from "../components/logError";

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
    private controller?: AbortController;
    private playbackRun?: Promise<boolean>;
    private retryTimer?: ReturnType<typeof setTimeout>;
    private generation = 0;
    private stopped = false;
    private destroyed = false;

    constructor(interaction?: Respondable) {
        this.player = createAudioPlayer({
            debug: false,
            behaviors: { maxMissedFrames: 100 }
        });

        // Register listeners once. Adding them for every track retains old
        // callbacks and eventually causes duplicate playback and memory growth.
        this.player.on(AudioPlayerStatus.Idle, () => {
            if (!this.destroyed && !this.stopped)
                void this.startNextTrack(this.generation);
        });

        this.player.on("error", (error) => {
            if (!this.destroyed && !this.stopped) {
                void this.startNextTrack(this.generation);
            }
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

        getVoiceConnection(this.data!.guildId)?.subscribe(this.player);

        return this.volume;
    }

    public isPaused = () => this.player.state.status === AudioPlayerStatus.Paused;

    public pause() {
        if (!this.isPaused())
            this.player.pause();

        getVoiceConnection(this.data!.guildId)?.subscribe(this.player);

        return this;
    }

    public resume() {
        if (this.isPaused())
            this.player.unpause();

        getVoiceConnection(this.data!.guildId)?.subscribe(this.player);

        return this;
    }

    /**
     * Stops playback and optionally destroys the connection
     */
    public stop(destroy = false) {
        this.stopped = true;
        this.generation++;
        this.controller?.abort();
        this.controller = undefined;

        if (this.retryTimer) {
            clearTimeout(this.retryTimer);
            this.retryTimer = undefined;
        }

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
            const generation = this.generation;
            const { stream, controller } = await this.createStream(url);

            // The station changed while the request was in flight.
            if (this.destroyed || this.stopped || generation !== this.generation) {
                controller.abort();
                return this.player;
            }

            const resource = createAudioResource(stream as any, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true,
                silencePaddingFrames: 10
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
        if (this.destroyed)
            throw this.error("Cannot start a destroyed player.");

        if (!resources?.length)
            throw this.error("Radio station has no streams.");

        // Cancel the previous stream before replacing the queue.
        this.stopped = true;
        this.generation++;
        this.controller?.abort();
        this.player.stop();

        if (this.retryTimer) {
            clearTimeout(this.retryTimer);
            this.retryTimer = undefined;
        }

        this.stopped = false;
        this.queue = this.shuffleArray(resources);
        this.currentTrackIndex = -1;

        await this.startNextTrack(this.generation);
    }

    /**
     * Handles sequential playback logic
     */
    private async startNextTrack(generation: number): Promise<void> {
        if (this.destroyed || this.stopped || generation !== this.generation || !this.queue.length)
            return;

        // VoiceStateUpdate and player events can arrive at the same time.
        // Share one playback operation instead of opening multiple streams.
        if (this.playbackRun) {
            await this.playbackRun;

            if (!this.destroyed && !this.stopped && generation !== this.generation)
                await this.startNextTrack(this.generation);

            return;
        }

        const run = (async (): Promise<boolean> => {
            try {
                if (++this.currentTrackIndex >= this.queue.length) {
                    this.queue = this.shuffleArray(this.queue);
                    this.currentTrackIndex = 0;
                }

                await this.play(this.queue[this.currentTrackIndex]);
                return false;
            }
            catch (error) {
                if (generation === this.generation && !this.destroyed && !this.stopped)
                    await logError(this.error(error));

                return true;
            }
        })();

        this.playbackRun = run;
        const failed = await run;

        if (this.playbackRun === run)
            this.playbackRun = undefined;

        if (this.destroyed || this.stopped)
            return;

        if (generation !== this.generation) {
            await this.startNextTrack(this.generation);
            return;
        }

        // Avoid a tight failure loop when a station host is unavailable.
        if (failed) {
            this.retryTimer = setTimeout(() => {
                this.retryTimer = undefined;
                void this.startNextTrack(this.generation);
            }, 1000);
        }
    }

    /**
     * Creates a readable stream from a URL with timeout protection
     */

    private async createStream(url: string): Promise<{
        stream: ReadableStream<Uint8Array>;
        controller: AbortController;
    }> {
        this.controller?.abort();

        const controller = new AbortController();
        this.controller = controller;
        const timeout = setTimeout(() => controller.abort(), 10_000);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: { "User-Agent": "Padio/1.0" }
            });

            if (!response.ok || !response.body) {
                throw this.error("Stream unreachable");
            }

            return { stream: response.body, controller };
        }

        catch (e) {
            if (!controller.signal.aborted)
                controller.abort();

            if (controller.signal.aborted && e instanceof Error && e.name === "AbortError")
                throw e;

            throw this.error("Stream Fetch Failed: Check URL or Host Network.");
        }

        finally {
            clearTimeout(timeout);
        }
    }

    destroy() {
        if (this.destroyed)
            return;

        this.destroyed = true;
        this.stop(false);

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