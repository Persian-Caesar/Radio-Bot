import {
    Client,
    ClientOptions,
    Collection,
    Partials
} from "discord.js";
import { CommandType } from "../types/interfaces";
import Database from "./Database";
import config from "../../config";
import post from "../functions/post";

export default class DiscordClient extends Client {
    commands: Collection<string, CommandType>;
    cooldowns: Collection<string, Collection<string, number>>;
    config: typeof config;
    db: Database | null;
    constructor(options?: ClientOptions) {
        if (!options)
            options = {
                intents: [
                    "GuildBans",
                    "GuildMembers",
                    "GuildMessages",
                    "GuildWebhooks",
                    "Guilds",
                    "MessageContent"
                ],
                partials: [
                    Partials.Channel,
                    Partials.GuildMember,
                    Partials.Message,
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
        this.token = this.config.discord.token;

        // initialize QuickDB
        this.db = null;
        this.setDB();

        // initialize player map
        // players: Map<string, MusicPlayer>;
        // this.players = new Map<string, MusicPlayer>();
    }

    private async setDB() {
        const
            databaseFile = await import("../utils/database"),
            loadDB = databaseFile.default || databaseFile,
            { db, dbType } = (await loadDB())!;

        if (db) {
            post(
                `Database Is Successfully Activated!! (Type: ${dbType})`,
                "S"
            );
            this.db = new Database(db);
        }

        return this;
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