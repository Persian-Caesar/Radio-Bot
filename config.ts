import { ConfigType } from "./src/types/interfaces";
import { config } from "dotenv";

// Support .env args
config();

export default {
    source: {
        // Send console erros to discord. on or off
        logger: process.env.logger === "true" ? true : false || false,
        // Anticrash on or off
        anti_crash: process.env.anti_crash === "true" ? true : false || false,

        database: {
            // Choose one type for save users and guilds data. Types: "mysql" | "sql" | "mongodb" | "json"
            type: process.env.database_type || "",
            // If you choose "mongodb" type place your mongo url.
            mongoURL: process.env.database_mongoURL || "",

            // If you choose "mysql" type place your Mysql server information.
            mysql: {
                // Place your Mysql server host name.
                host: process.env.database_msql_host || "",
                // Place your Mysql server username.
                user: process.env.database_msql_user || "",
                // Place your Mysql server password.
                password: process.env.database_msql_password || "",
                // Place your Mysql server database name.
                database: process.env.database_msql_database || ""
            }
        }
    },

    discord: {
        // Bot default language in discord.
        default_language: process.env.default_language || "en",
        // One Guild on or off
        one_guild: process.env.one_guild === "true" ? true : false || false,
        // Delete slash commands each time you run the source.
        delete_commands: process.env.delete_commands === "true" ? true : false || false,
        // Bot status loop. (By default it's every 30 seconds)
        status_loop: parseInt(process.env.status_loop_count) || 30 * 1000,
        // Bot token.
        token: process.env.token || "",
        // Bot message command prefix.
        prefix: process.env.prefix || "",

        status: {
            // Set bot status activity, you can change it. | You can use "{members}" variable to shows bot all users or {servers} to shows counts of all servers bot joined.
            activity: JSON.parse(process.env.status_activity || "[]") || [],
            // Set bot status type and it"s can be: "Competing" | "Listening" | "Playing" | "Streaming" | "Watching" | "Custom"
            type: JSON.parse(process.env.status_type || "[]") || [],
            // Set bot status presence and it"s can be: "online" | "dnd" | "idle" | "offline"
            presence: JSON.parse(process.env.status_presence || "[]") || []
        },

        // Discord bot invite link with no permission.
        noperms_invite: "https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id={clientId}",
        // Discord bot invite link with administrator permission.
        admin_invite: "https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id={clientId}&permissions=8",
        // Discord bot invite link with recommended permission.
        default_invite: "https://discord.com/api/oauth2/authorize?scope=bot+applications.commands&client_id={clientId}&permissions=3230729",

        support: {
            // Support server invite link.
            invite: process.env.support_url || "https://discord.gg/AfkuXgCKAQ",
            // Support server Id.
            id: process.env.support_id || "",
            // Id of  channel to send bot stats on discord.
            stats_channel: process.env.support_stats || "",
            // Interval timer for update status message it's by default 1 hours.
            update_stats_interval: parseInt(process.env.update_stats_interval) || 1000 * 60 * 60,
            // Activate auto bot status message updator.
            update_stats_message: process.env.update_stats_message === "true" ? true : false || false,
            webhook: {
                // Webhook logger url.
                url: process.env.webhook_url || "",
                // Webhook logger avatar.
                avatar: process.env.webhook_avatar || "",
                // Webhook logger username.
                username: process.env.webhook_username || "",

                threads: {
                    // Id of thread for webhook to bot status alerts.
                    status: process.env.webhook_thread_status || "",
                    // Id of thread for webhook to send console errors.
                    bugs: process.env.webhook_thread_bugs || "",
                    // Id of thread for webhook to send users report messages.
                    report: process.env.webhook_thread_report || ""
                }
            },

            // Source owners.
            owners: JSON.parse(process.env.owners || "[]") || []
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