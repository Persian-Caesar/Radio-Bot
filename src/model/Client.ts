import {
    Client,
    ClientOptions,
    Collection,
    Partials
} from "discord.js";
import { CommandType } from "../types/command/type";
import Database from "../database/Database";
import config from "../../config";
import PlayerManager from "./PlayerManager";

export default class DiscordClient extends Client {
    public commands: Collection<string, CommandType>;
    public cooldowns: Collection<string, Collection<string, number>>;
    public players?: Map<string, PlayerManager>;
    public config: typeof config;
    public db: Database | null = null;
    private cleanupTasks = new Set<() => void | Promise<void>>();
    constructor(options?: ClientOptions) {
        if (!options)
            options = {
                intents: [
                    "Guilds",
                    "GuildVoiceStates"
                ],
                partials: [
                    Partials.GuildMember,
                    Partials.Channel,
                    Partials.User
                ],
                allowedMentions: {
                    repliedUser: true
                }
            };

        super(options);
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.config = config;
        this.token = config.discord.token;
        this.players = new Map();
    }

    public registerCleanup(task: () => void | Promise<void>): () => void {
        this.cleanupTasks.add(task);

        return () => this.cleanupTasks.delete(task);
    }

    public async gracefulShutdown(): Promise<void> {
        for (const task of this.cleanupTasks) {
            try {
                await task();
            }

            catch (error) {
                console.error("Cleanup task failed:", error);
            }
        }

        this.cleanupTasks.clear();

        for (const player of this.players?.values() ?? []) {
            try {
                player.destroy();
            }
            
            catch (error) {
                console.error("Player cleanup failed:", error);
            }
        }

        this.players?.clear();
        this.destroy();
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