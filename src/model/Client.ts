import {
    Client,
    ClientOptions,
    Collection,
    Partials
} from "discord.js";
import { CommandType } from "../types/interfaces";
import Database from "../database/Database";
import config from "../../config";

export default class DiscordClient extends Client {
    public commands: Collection<string, CommandType>;
    public cooldowns: Collection<string, Collection<string, number>>;
    public config: typeof config;
    public db: Database | null = null;
    constructor(options?: ClientOptions) {
        if (!options)
            options = {
                intents: [
                    "Guilds",
                    "GuildMembers",
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