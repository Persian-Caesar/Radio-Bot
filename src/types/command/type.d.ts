import { ChatInputCommandInteraction } from "discord.js";
import DiscordClient from "../../model/Client";

export interface CommandOption {
    name: string;
    description: string;
    type: ApplicationCommandOptionType;
    channel_types?: ChannelType[];
    required?: boolean;
    options?: CommandOptions;
    autocomplete?: boolean;
    choices?: Array<{ name: string, value: string }>;
    default_member_permissions?: PermissionsBitField;
    default_bot_permissions?: PermissionsBitField;
    usage?: string;
}

export interface CommandType {
    data: {
        id?: string;
        name: string;
        description: string;
        type?: ApplicationCommandType;
        default_member_permissions?: PermissionsBitField;
        default_bot_permissions?: PermissionsBitField;
        dm_permission?: boolean;
        nsfw?: boolean;
        options?: CommandOptions;
    };
    category: Categoris;
    usage?: string;
    cooldown?: number;
    only_owner?: boolean;
    inactive?: boolean;
    run: (client: DiscordClient, interaction: ChatInputCommandInteraction) => Promise<any>;
};

export type CommandOptions = CommandOption[] | [];

export type Categoris = "misc" | "admin" | "music" | "owner";

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */