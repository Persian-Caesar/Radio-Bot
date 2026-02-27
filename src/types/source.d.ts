import {
    Guild,
    TextChannel
} from "discord.js";
import DiscordClient from "../model/Client";

export interface SendGuildAlert {
    client: DiscordClient,
    guild: Guild,
    guildChannel?: TextChannel | null,
    isWebhook?: boolean,
    description?: string,
    isLeaved?: boolean
}

export interface PackageJson {
    name: string;
    version: string;
}


/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */