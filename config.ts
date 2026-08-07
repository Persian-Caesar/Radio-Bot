import { ConfigType } from "./src/types/config/type";
import { config } from "dotenv";

// Support .env args
config();

function parseJson<T>(value: string | undefined, fallback: T): T {
    if (!value)
        return fallback;

    try {
        return JSON.parse(value) as T;
    }
    
    catch (error) {
        console.error("Invalid JSON configuration. Using the default value.", error);
        return fallback;
    }
}

function parseInterval(value: string | undefined, fallback: number): number {
    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 1_000 ? parsed : fallback;
}

export default {
    source: {
        // Send console erros to discord. on or off
        logger: process.env.LOGGER_ENABLED === "true" ? true : false || false,

        // Anticrash on or off
        anti_crash: process.env.ANTI_CRASH === "true" ? true : false || false,

        database: {
            // Choose one type for save users and guilds data. Types: "mysql" | "sql" | "mongodb" | "json"
            type: process.env.DATABASE_TYPE || "",

            // If you choose "mongodb" type place your mongo url.
            mongoURL: process.env.DATABASE_MONGO_URL || "",

            // If you choose "mysql" type place your Mysql server information.
            mysql: {
                // Place your Mysql server host name.
                host: process.env.DATABASE_MYSQL_HOST || "",

                // Place your Mysql server username.
                user: process.env.DATABASE_MYSQL_USER || "",

                // Place your Mysql server password.
                password: process.env.DATABASE_MYSQL_PASSWORD || "",

                // Place your Mysql server database name.
                database: process.env.DATABASE_MYSQL_NAME || ""
            }
        }
    },

    discord: {
        // Bot default language in discord.
        default_language: process.env.DEFAULT_LANGUAGE || "en",

        // One Guild on or off
        one_guild: process.env.ONE_GUILD === "true" ? true : false || false,

        // Delete slash commands each time you run the source.
        delete_commands: process.env.DELETE_COMMANDS === "true" ? true : false || false,

        // Bot status loop. (By default it's every 30 seconds)
        status_loop: parseInterval(process.env.UPDATE_STATS_INTERVAL, 30 * 1000),

        // Bot token.
        token: process.env.TOKEN || "",

        status: {
            // Set bot status activity, you can change it. | You can use "{members}" variable to shows bot all users or {servers} to shows counts of all servers bot joined.
            activity: parseJson<string[]>(process.env.STATUS_ACTIVITY, []),
            // Set bot status type and it"s can be: "Competing" | "Listening" | "Playing" | "Streaming" | "Watching" | "Custom"
            type: parseJson<(keyof typeof import("discord.js").ActivityType)[]>(
                process.env.STATUS_TYPE,
                []
            ),
            // Set bot status presence and it"s can be: "online" | "dnd" | "idle" | "offline"
            presence: parseJson<import("discord.js").PresenceStatusData[]>(
                process.env.STATUS_PRESENCE,
                []
            )
        },

        // Discord bot invite link with no permission.
        noperms_invite: "https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id={clientId}",
        // Discord bot invite link with administrator permission.
        admin_invite: "https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id={clientId}&permissions=8",
        // Discord bot invite link with recommended permission.
        default_invite: "https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id={clientId}&permissions=3230729",

        support: {
            // Support server invite link.
            invite: process.env.SUPPORT_SERVER_URL || "https://discord.gg/AfkuXgCKAQ",

            // Support server Id.
            id: process.env.SUPPORT_SERVER_ID || "",

            // Id of  channel to send bot stats on discord.
            stats_channel: process.env.SUPPORT_STATS_CHANNEL_ID || "",

            // Interval timer for update status message it's by default 1 hours.
            update_stats_interval: parseInterval(
                process.env.UPDATE_STATS_INTERVAL,
                1000 * 60 * 60
            ),

            // Activate auto bot status message updator.
            update_stats_message: process.env.UPDATE_STATS_MESSAGE === "true" ? true : false || false,
            webhook: {
                // Webhook logger avatar.
                avatar: process.env.WEBHOOK_AVATAR_URL || "",

                // Webhook logger username.
                username: process.env.WEBHOOK_USERNAME || "",

                // Id of thread for webhook to bot status alerts.
                status: process.env.WEBHOOK_URL_STATUS || "",

                // Id of thread for webhook to send console errors.
                bugs: process.env.WEBHOOK_URL_BUGS || "",

                // Id of thread for webhook to send users report messages.
                report: process.env.WEBHOOK_URL_REPORT || ""
            },

            // Source owners.
            owners: parseJson<string[]>(process.env.OWNERS, [])
        },

        // Addess of bot discordbotlist page.
        discordbotlist: "https://discordbotlist.com/bots/padio"
    }
} as ConfigType;

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */