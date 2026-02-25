import {
    BooleanString,
    ConfigDatabaseTypes
} from "./types";


/* ------------------------------------------------ */
/*                ProcessEnv Extension              */
/* ------------------------------------------------ */
declare global {
    namespace NodeJS {
        interface ProcessEnv {

            /* ---------------------------------------- */
            /*                BOT CORE                  */
            /* ---------------------------------------- */

            /**
             * Discord bot token.
             * Required for authentication with the Discord Gateway and REST API.
             *
             * ⚠ Never expose this publicly.
             */
            TOKEN: string;

            /**
             * Default prefix for message-based (non-slash) commands.
             * Only used if the bot supports traditional prefix commands.
             *
             * Example: "!"
             */
            PREFIX: string;

            /**
             * Deletes all registered slash commands
             * every time the bot starts.
             *
             * ⚠ Intended for development only.
             * Avoid enabling in production due to
             * rate limits and command propagation delays.
             *
             * true  → Delete commands on startup
             * false → Keep existing commands
             */
            DELETE_COMMANDS: BooleanString;


            /* ---------------------------------------- */
            /*            BOT STATUS CONFIG             */
            /* ---------------------------------------- */

            /**
             * Bot activity messages.
             * Must be a JSON stringified array.
             *
             * Supported placeholders:
             * {members}, {servers}, {usedCommands},
             * {joinedVoiceChannels}, {prefix}
             *
             * Example:
             * '["Serving {members} users"]'
             */
            STATUS_ACTIVITY: string;

            /**
             * Activity types corresponding to STATUS_ACTIVITY entries.
             * Must be a JSON stringified array.
             *
             * Allowed values:
             * Competing | Listening | Playing | Streaming | Watching | Custom
             */
            STATUS_TYPE: string;

            /**
             * Presence status values corresponding to STATUS_ACTIVITY entries.
             * Must be a JSON stringified array.
             *
             * Allowed values:
             * online | idle | dnd | offline
             */
            STATUS_PRESENCE: string;


            /* ---------------------------------------- */
            /*             DATABASE CONFIG              */
            /* ---------------------------------------- */

            /**
             * Database engine used for persistent storage.
             *
             * Available:
             * json      → Local file storage (development)
             * mysql     → MySQL server
             * mongodb   → MongoDB cluster
             * sql       → Generic SQL-based database
             */
            DATABASE_TYPE: ConfigDatabaseTypes;

            /**
             * MongoDB connection URI.
             * Required when DATABASE_TYPE = "mongodb".
             */
            DATABASE_MONGO_URL: string;

            /**
             * MySQL host address or IP.
             * Required when DATABASE_TYPE = "mysql".
             */
            DATABASE_MYSQL_HOST: string;

            /**
             * MySQL username.
             */
            DATABASE_MYSQL_USER: string;

            /**
             * MySQL password.
             */
            DATABASE_MYSQL_PASSWORD: string;

            /**
             * MySQL database name.
             */
            DATABASE_MYSQL_NAME: string;


            /* ---------------------------------------- */
            /*           SUPPORT INFORMATION            */
            /* ---------------------------------------- */

            /**
             * Discord ID of the official support server.
             * Used for internal validation and statistics.
             */
            SUPPORT_SERVER_ID: string;

            /**
             * Permanent invite URL for the support server.
             */
            SUPPORT_SERVER_URL: string;

            /**
             * Channel ID where statistics or reports are sent.
             */
            SUPPORT_STATS_CHANNEL_ID: string;


            /* ---------------------------------------- */
            /*             WEBHOOK LOGGER               */
            /* ---------------------------------------- */

            /**
             * Custom avatar URL used for webhook log messages.
             * Optional.
             */
            WEBHOOK_AVATAR_URL: string;

            /**
             * Display name used when sending webhook logs.
             */
            WEBHOOK_USERNAME: string;

            /**
             * Webhook URL for bug reports.
             */
            WEBHOOK_URL_BUGS: string;

            /**
             * Webhook URL for user-submitted reports.
             */
            WEBHOOK_URL_REPORT: string;

            /**
             * Webhook URL for system status and runtime logs.
             */
            WEBHOOK_URL_STATUS: string;


            /* ---------------------------------------- */
            /*           AUTO STATUS UPDATE             */
            /* ---------------------------------------- */

            /**
             * Enables automatic statistics message updates.
             *
             * true  → Enabled
             * false → Disabled
             */
            UPDATE_STATS_MESSAGE: BooleanString;

            /**
             * Interval (in milliseconds) for updating statistics messages.
             *
             * Example: "3600000" (1 hour)
             */
            UPDATE_STATS_INTERVAL: string;


            /* ---------------------------------------- */
            /*               BOT CONTROL                */
            /* ---------------------------------------- */

            /**
             * JSON stringified array of Discord user IDs
             * with full owner-level permissions.
             *
             * Example:
             * '["123456789012345678"]'
             */
            OWNERS: string;

            /**
             * Default bot language (ISO 639-1 code).
             *
             * Example:
             * "en", "fa", "de"
             */
            DEFAULT_LANGUAGE: string;

            /**
             * Enables crash protection and automatic error handling.
             *
             * true  → Enabled
             * false → Disabled
             */
            ANTI_CRASH: BooleanString;

            /**
             * Restricts the bot to a single guild (development mode).
             *
             * true  → Single guild only
             * false → Public multi-guild bot
             */
            ONE_GUILD: BooleanString;

            /**
             * Enables sending runtime errors to Discord via webhook.
             *
             * true  → Enabled
             * false → Disabled
             */
            LOGGER_ENABLED: BooleanString;
        }
    }
    
    interface Array<T> {
        /**
         * Retunr random item from array.
         */
        random(): T;

        /**
         * @param size What size you want make an array chunk?
         * @description
         * Make a chunk about your array.
         * 
         * @example
         * [1, 2, 3, 4].chunk(2) => [[1,2], [3,4]]
         */
        chunk(size: number): T[][]
    }

    interface String {
        /**
         * Replace item you want replace it.
         * @example
         * ```js
         * "{item} is item.".replaceValues({ item: "glass" }) // "glass is item"
         * ```
         * @param object - any item you want to replace it.
         */
        replaceValues(object: Record<string, string>): string;


        /**
         * Doing capitalizing string.
         */
        toCapitalize(): string;

        /**
         * Change hex color code string to the hex decimal number. 
         */
        HexToNumber(): number;

        /**
         * Convert english numbers in text to persian. 
         */
        convertToPersianString(): string;
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