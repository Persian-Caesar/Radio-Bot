export interface ConfigType {
    source: {
        anti_crash: boolean, // Anticrash on or off
        logger: boolean, // Send console erros to discord. on or off
        database: {
            type: ConfigDatabaseTypes, // Choose one type for save users and guilds data. Types: "mysql" | "sql" | "mongodb" | "json"
            mongoURL: string, // If you choose "mongodb" type place your mongo url.
            mysql: {
                host: string, // Place your Mysql server host name.
                user: string, // Place your Mysql server username.
                password: string, // Place your Mysql server password.
                database: string // Place your Mysql server database name.
            } // If you choose "mysql" type place your Mysql server information.
        }
    },
    discord: {
        default_language: Languages, // Bot default language in discord.
        one_guild: boolean, // One Guild on or off
        delete_commands: boolean, // Delete slash commands each time you run the source.
        status_loop: number, // Bot status loop. (By default it's every 30 seconds)
        token: string, // Bot token.
        status: {
            activity: string[], // Set bot status activity, you can change it. | You can use "{members}" variable to shows bot all users or {servers} to shows counts of all servers bot joined.
            type: (keyof typeof ActivityType)[], // Set bot status type and it"s can be: "Competing" | "Listening" | "Playing" | "Streaming" | "Watching" | "Custom"
            presence: PresenceStatusData[] // Set bot status presence and it"s can be: "online" | "dnd" | "idle" | "offline"
        },
        noperms_invite: string, // Discord bot invite link with no permission.
        admin_invite: string, // Discord bot invite link with administrator permission.
        default_invite: string, // Discord bot invite link with recommended permission.
        support: {
            invite: string, // Support server invite link.
            id: string, // Support server Id.
            stats_channel: string, // Id of  channel to send bot stats on discord.
            update_stats_message: boolean, // Activate auto bot status message updator.
            update_stats_interval: number, // Interval timer for update status message it's by default 1 hours.
            webhook: {
                avatar: string, // Webhook logger avatar.
                username: string, // Webhook logger username.
                status: string, // Id of thread for webhook to bot status alerts.
                bugs: string, // Id of thread for webhook to send console errors.
                report: string // Id of thread for webhook to send users report messages.
            },
            owners: string[] // Source owners.
        },
        discordbotlist: string // Addess of bot discordbotlist page.
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