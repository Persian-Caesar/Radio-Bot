import { EnvBoolean } from "./types";

declare global {
    declare namespace NodeJS {
        interface ProcessEnv {
            default_timeout: string;
            anti_crash: EnvBoolean;
            database_mongoURL: string;
            database_msql_database: string;
            database_msql_host: string;
            database_msql_password: string;
            database_msql_user: string;
            database_type: "json" | "mysql" | "mongodb" | "sql";
            default_language: string;
            logger: EnvBoolean;
            one_guild: EnvBoolean;
            owners: string;
            prefix: string;
            status_loop_count: string;
            status_activity: string;
            status_presence: string;
            status_type: string;
            support_id: string;
            support_url: string;
            update_stats_interval: string;
            update_stats_message: EnvBoolean;
            token: string;
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