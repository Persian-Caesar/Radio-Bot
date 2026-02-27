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

export interface PlayerData {
    channelId: string;
    guildId: string,
    adapterCreator: InternalDiscordGatewayAdapterCreator;
    selfDeaf?: boolean;
    selfMute?: boolean;
    debug?: boolean;
    group?: string;
}

export default class {
    public queue: string[];
    public currentTrackIndex: number;
    public player: AudioPlayer;
    public data: PlayerData | undefined = undefined;
    constructor(interaction?: Respondable) {
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
                channelId: (interaction.member as GuildMember)!.voice?.channel!.id,
                guildId: interaction.guildId!,
                adapterCreator: interaction.guild!.voiceAdapterCreator,
                selfDeaf: true
            };

        return this;
    }

    public setData(
        { channelId, guildId, adapterCreator, selfDeaf = true, debug = false, group, selfMute = false }
            : CreateVoiceConnectionOptions & JoinVoiceChannelOptions
    ) {
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

    public join(data: CreateVoiceConnectionOptions & JoinVoiceChannelOptions | null = null) {
        if (!data)
            data = this.data!;

        return joinVoiceChannel(data);
    }

    public isConnected(guildId?: string) {
        if (!guildId)
            guildId = this.data!.guildId;

        return !!getVoiceConnection(guildId);
    }

    public get connection() {
        let connection = getVoiceConnection(this.data!.guildId);
        if (!connection)
            connection = this.join();

        return connection;
    }

    public get volume() {
        const playerResource = (this.player.state as AudioPlayerPlayingState).resource;
        if (!playerResource || !playerResource.volume)
            return 0;

        return Number(playerResource?.volume?.volume * 100);
    }

    public setVolume(input: number) {
        const playerResource = (this.player.state as AudioPlayerPlayingState).resource;
        if (!playerResource || !playerResource.volume)
            return 0;

        if (input <= 200 && input >= 0)
            playerResource.volume.volume = input / 100;

        this.connection.subscribe(this.player);
        return Number(this.volume);
    }

    public isPaused() {
        return this.player && this.player.state.status === AudioPlayerStatus.Paused;
    }

    public pause() {
        if (this.player && !this.isPaused())
            this.player.pause();

        this.connection.subscribe(this.player);
        return this;
    }

    public resume() {
        if (this.player && this.isPaused())
            this.player.unpause();

        this.connection.subscribe(this.player);
        return this;
    }

    public stop(destroy = false) {
        if (this.player)
            this.player.stop();

        if (destroy && this.connection)
            this.connection.destroy();

        return this;
    }

    public async play(resource: string) {
        try {
            const
                connection = this.connection || this.join(),
                stream = await this.createStream(resource) as any,

                audio = createAudioResource(stream, {
                    inputType: StreamType.Arbitrary,
                    inlineVolume: true,
                    silencePaddingFrames: 5
                });

            this.player.play(audio);
            (this.player.state as AudioPlayerPlayingState).resource.volume!.volume = 1; // 100%
            connection.subscribe(this.player);

            return this.player;
        }

        catch (e) {
            throw this.error(e);
        }
    }

    public async radio(resources: string[]) {
        const shuffledLinks = this.shuffleArray(resources);
        this.queue = shuffledLinks;
        this.currentTrackIndex = -1; // Reset track index
        await this.playNext();

        return;
    }

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
        }

        catch (e) {
            this.error(e);
        }
    }

    private async createStream(url: string) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(url, { signal: controller.signal }).catch(() => null);
            clearTimeout(timeout);

            if (!response || !response.ok)
                throw this.error("Failed to fetch stream");

            return response.body;
        }

        catch (e) {
            throw this.error(e);
        }
    }

    private shuffleArray(array: string[]) {
        let shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private error(message: any) {
        if (!("message" in message))
            message = new Error(message);

        class PlayerError extends Error {

            constructor(error: any) {
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

        return new PlayerError(message);
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