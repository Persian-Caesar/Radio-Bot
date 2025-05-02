import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChannelType,
    CommandInteraction,
    Guild,
    Message,
    PermissionsBitField,
    TextChannel
} from "discord.js";
import {
    Categoris,
    CommandOptions
} from "./types";
import DiscordClient from "../classes/Client";

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
    aliases?: string[];
    usage?: string;
    cooldown?: number;
    only_owner?: boolean;
    only_slash?: boolean;
    only_message?: boolean;
    run: (client: DiscordClient, interaction: CommandInteraction | Message, args?: string[]) => Promise<any>;
};

export interface Language {
    "replies": {
        "onlyOwner": string | "```diff\n- Bored? This command is not for you! Don't touch it!```",
        "botPerm": string | "**-# I (the bot) don’t have the required permissions to execute the command {mention_command}!\nRequired permissions: [{bot_perms}]**",
        "userPerm": string | "**-# You don’t have the required permissions to use the command {mention_command}!\nRequired permissions: [{user_perms}]**",
        "error": string | "Unfortunately, an error occurred.",
        "cooldown": string | "**-# Due to excessive usage, you are temporarily banned from using the {mention_command} command. You can use it again after <t:{expired_timestamp}:R>.**",
        "ephemeral": {
            "description": string | "Do you want to keep this message hidden?",
            "choices": {
                "yes": string | "Yes",
                "no": string | "No"
            }
        },
        "noConnection": string | "```diff\n- I'm currently not playing any file and not in the channel.```",
        "noChannelError": string | "```diff\n- You need to connect to a voice channel.```",
        "notMatchedVoice": string | "```diff\n- Your voice channel does not match mine. Please join the channel I’m in.```",
        "noPermToView": string | "```diff\n- I cannot view the channel. Please grant me the 'ViewChannel' permission.```",
        "noPermToConnect": string | "```diff\n- I cannot connect to the channel. Please grant me the 'Connect' permission.```",
        "channelFull": string | "```diff\n- This voice channel is full!```",
        "userDeaf": string | "```diff\n- You cannot use this command while you are deafened.```",
        "clientMute": string | "```diff\n- Please unmute me first before trying again.```",
        "guildCreate": string | "**-# I’ve recently joined a new server, now I’m in `{guilds}` servers.**",
        "guildDelete": string | "**-# I’ve been removed from a server, but I’m still in `{guilds}` servers.**",
        "errorEmbed": {
            "title": string | "An error occurred!",
            "name": string | "Name:",
            "code": string | "Code:",
            "httpStatus": string | "HTTP Status:",
            "timestamp": string | "Timestamp:"
        },
        "webhookBug": string | "There’s an issue sending errors to the Discord webhook!",
        "mainErrorLog": string | "Main error:",
        "ipError": string | "Unfortunately, your IP has been blocked by Discord. It’s recommended to use a new IP.",
        "loginError": string | "An error occurred. Either your bot token is incorrect or some bot permissions have been disabled :(",
        "noTokenError": string | "You haven’t entered your bot token in the config.js or .env file!",
        "guildAlert": string | "**-# The total number of servers I’m in is now `{guilds}`.**",
        "guild": {
            "owner": string | "Owner:",
            "guild": string | "Server:",
            "createdAt": string | "Created on:"
        },
        "loadDatabase": string | "The database connected successfully! (Type: {type})",
        "databaseError": string | "The database failed to connect! (Type: {type})",
        "loadCommands": string | "{cmdCount} {type} commands loaded successfully!",
        "loadCommandError": string | "Command failed to load:",
        "loadEvents": string | "{count} events loaded successfully!",
        "status": {
            "title": string | "Bot Status",
            "guilds": string | "Total servers:",
            "users": string | "Total users:",
            "commands": string | "Commands:",
            "ping": string | "Response time:",
            "uptime": string | "Uptime:",
            "memory": string | "Memory:",
            "cpu": string | "CPU:",
            "version": string | "Bot version:",
            "refresh": string | "Refresh",
            "invite": string | "Invite me",
            "vote": string | "Vote for me"
        },
        "loadBot": string | "Logging into the bot...",
        "loadHandlers": string | "{count} handlers loaded successfully!",
        "uploadSlashCmd": string | "Updating {count} slash (/) commands.",
        "sucessUploadSlashCmd": string | "{count} slash (/) commands successfully reloaded.",
        "alertBotIsOnline": string | "Discord bot is online!",
        "botIsOnline": string | "{name} is now online :)",
        "buttons": {
            "buttonNo": string | "No",
            "buttonYes": string | "Yes",
            "update": string | "Bot Updates"
        },
        "modals": {
            "reportModalTitle": string | "Report",
            "reportModalLabel": string | "What would you like to report?",
            "reportModalPlaceholder": string | "Example: Hi, when I used the bot, the help command didn't work.",
            "reportEmbedDescription": string | "**Report:**\n{message}\n\n**-# From {user}**",
            "sendReport": string | "```diff\n+ Your report has been successfully sent to the developers and will be reviewed within a few days.```"
        },
        "sendPrefix": string | "My prefix in this server is: {prefix}"
    },
    "commands": {
        "setup": {
            "description": string | "Save server settings to the database.",
            "subCommands": {
                "panel": {
                    "description": string | "Create a radio control panel.",
                    "options": {
                        "channel": string | "Please select your desired channel."
                    },
                    "replies": {
                        "panelTitle": string | "Radio Control",
                        "panelMenu": string | "Select your preferred network.",
                        "success": string | "**-# The radio control panel was successfully set up in the <#{channel}> channel.**",
                        "doDeleteChannel": string | "**-# To set up the panel in a new channel, please select the desired channel. The current channel <#{channel}> is already registered for the panel. If you wish to delete it, use the buttons below.**",
                        "noChannel": string | "```diff\n- Please mention a text channel.```",
                        "deleteChannel": string | "**-# The channel was successfully removed from the database.**"
                    }
                },
                "prefix": {
                    "description": string | "Set a custom prefix for bot commands.",
                    "options": {
                        "input": string | "Enter your desired prefix."
                    },
                    "replies": {
                        "doDeletePrefix": string | "**-# The current command prefix for this server is `{prefix}`. To change it, please enter a new prefix. To revert to the default, use the buttons below.**",
                        "deletePrefix": string | "**-# The bot's prefix has been reset to the default (`{prefix}`).**",
                        "noPrefix": string | "```diff\n- Please enter your desired prefix!```",
                        "success": string | "**-# The bot's prefix has been successfully changed to {prefix}!**"
                    }
                },
                "language": {
                    "description": string | "Set the bot's language.",
                    "options": {
                        "input": string | "Select your desired language."
                    },
                    "replies": {
                        "doDeleteLanguage": string | "**-# To change the bot's language, select a new one. To revert to the default language, use the buttons below.**",
                        "deleteLanguage": string | "**-# The bot's language has been reset to the default (`{language}`).**",
                        "noLanguage": string | "**-# Please enter your desired language!**\n```json\n{languages}```",
                        "success": string | "**-# The bot's language has been successfully changed to `{language}`!**"
                    }
                }
            }
        },
        "about": {
            "description": string | "Displays information about the bot"
        },
        "help": {
            "description": string | "Display bot commands",
            "replies": {
                "invalidUser": string | "This button is for {author} only, and you are not authorized to use it.\nTo use the buttons, run the command \"{mention_command}\".",
                "noPlayerError": string | "No player is active on this server. Please create a player.",
                "notMatchedVoice": string | "Your voice channel does not match mine. Please join the channel I'm in.",
                "success": string | "The music playback panel was successfully set up in the {channel} channel.",
                "embed": {
                    "author": string | "Bot Guide",
                    "footer": string | "Requested by",
                    "field1": string | "About me:",
                    "value1": string | ">>> Hello! I'm **{username} {emote}**\nI'm an advanced radio bot designed for voice channels, providing users with a wide variety of high-quality online radio stations to enjoy. Whether you're looking to relax or manage your server's music experience, Padio has you covered!",
                    "field2": string | "View my commands:",
                    "value2": string | ">>> To see all the commands, click on the menu below this message."
                },
                "menu": string | "Click to view!",
                "buttons": {
                    "home": string | "Home"
                },
                "aliases": string | "Other names:",
                "description": string | "Description:",
                "noCommands": string | "`No commands found in this category.`"
            }
        },
        "invite": {
            "description": string | "Get the invite link for the bot.",
            "replies": {
                "embedFooter": string | "Make sure to configure the permissions properly if using the No Role invite!",
                "embedDescription": string | "Choose one of the invite links below based on your preferences:",
                "embedTitle": string | "Invite {username} to your server!",
                "fields": {
                    "links": string | "Where to find {username}:",
                    "noRole": string | "No Role Invite",
                    "suggest": string | "Suggested Invite"
                },
                "values": {
                    "suggest": string | "[Invite {username} with all permissions]({link})",
                    "noRole": string | "[Invite without requesting any permissions]({link})"
                }
            }
        },
        "ping": {
            "description": string | "Display the bot's ping",
            "replies": {
                "pinging": string | "Processing...",
                "ping": string | "Pong!",
                "fields": {
                    "pinging": string | "Bot speed:",
                    "time": string | "API response time:",
                    "uptime": string | "Uptime:",
                    "memory": string | "Memory:"
                },
                "values": {
                    "pinging": string | "Host speed:"
                }
            }
        },
        "report": {
            "description": string | "Report bot malfunction and bugs",
            "replies": {
                "reportButton": string | "Submit Report"
            }
        },
        "afk": {
            "description": string | "Enable AFK mode for the server’s voice channel.",
            "options": {
                "channel": string | "Please select your desired voice channel."
            },
            "replies": {
                "noChannelError": string | "```diff\n- Please mention a voice channel or join one.```",
                "noPlayerError": string | "```diff\n- No player is active on this server. Please create a player.```",
                "notMatchedVoice": string | "```diff\n- Your voice channel does not match mine. Please join the channel I’m in.```",
                "success": string | "The music playback panel was successfully set up in the {channel} channel.",
                "doDeleteChannel": string | "**-# To change the AFK channel, please mention the new one. To remove it from the database, use the buttons below.**",
                "deleteChannel": string | "**-# The channel was successfully removed from the database.**"
            }
        },
        "pause": {
            "description": string | "Temporarily stop the player.",
            "replies": {
                "paused": string | "The player has been successfully paused."
            }
        },
        "resume": {
            "description": string | "Resume the player.",
            "replies": {
                "resumed": string | "The player has been successfully resumed."
            }
        },
        "play": {
            "description": string | "Play a radio station in the voice channel.",
            "options": {
                "station": string | "Please select one of the stations."
            },
            "replies": {
                "onlyPanel": string | "This command can only be used in the <#{channel}> channel.",
                "invalidQuery": string | "**-# The selected station is invalid! Please choose from the stations below:**\n```json\n{stations}```",
                "play": string | "**-# The station `{song}` was successfully played.**"
            }
        },
        "stop": {
            "description": string | "Stop and remove the player from the voice channel.",
            "replies": {
                "stopped": string | "The player was successfully stopped and removed."
            }
        },
        "volume": {
            "description": string | "Set or display the player’s volume.",
            "options": {
                "input": string | "Please select a volume level between 0 and 200."
            },
            "replies": {
                "currentVolume": string | "The current player volume is `{volume}%`.",
                "footer": string | "To change the volume, use the command '/volume <1-200>'.",
                "invalidInput": string | "```diff\n- Invalid input. Please enter a number between 0 and 200.```",
                "success": string | "The player’s volume was successfully changed to `{volume}%`."
            }
        },
        "setactivity": {
            "description": string | "Temporarily change the bot’s status.",
            "replies": {
                "invalidStatus": string | "```diff\n- Invalid status!\n+ Correct input: status:[status name]\n+ Status name can be one of the following: [{status}]```",
                "invalidActivity": string | "```diff\n- Invalid activity!\n+ Correct input: type:[activity name]\n+ Activity type can be one of the following: [{activity}]```",
                "activityName": string | "Hello, World",
                "success": string | "✅| The bot's status has been temporarily changed.\n```js\n{data}```"
            }
        },
        "guilds": {
            "description": string | "Display the list of the bot's servers.",
            "replies": {
                "cantFindGuilds": string | "This ID was not found.",
                "embed": {
                    "guild": string | "Server:",
                    "owner": string | "Owner:",
                    "date": string | "Date:",
                    "dateValue": string | "Created at {createdAt} | Joined at {joinedAt}",
                    "page": string | "Page",
                    "allGuilds": string | "All Servers:",
                    "members": string | "Members"
                },
                "joinButton": string | "Join {guild}"
            }
        }
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