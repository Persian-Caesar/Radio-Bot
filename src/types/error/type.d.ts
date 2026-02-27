/**
 * Enum for Error Codes to maintain consistency across the bot
 */
export enum ErrorCode {
    // Permission Errors
    MISSING_USER_PERMISSIONS = "ERR_USR_PERM",
    MISSING_BOT_PERMISSIONS = "ERR_BOT_PERM",

    // Voice/Music Errors
    NOT_IN_VOICE = "ERR_NO_VC",
    CHANNEL_FULL = "ERR_VC_FULL",
    NOT_VIEWABLE = "ERR_VC_HIDDEN",
    NOT_JOINABLE = "ERR_VC_LOCKED",
    USER_DEAFENED = "ERR_USR_DEAF",

    // Command/Argument Errors
    MISSING_ARGUMENT = "ERR_MISSING_ARG",
    INVALID_NUMBER = "ERR_INVALID_NUM",
    INVALID_CHOICE = "ERR_INVALID_CHOICE",
    COOLDOWN_ACTIVE = "ERR_COOLDOWN",

    // General Errors
    INTERNAL_ERROR = "ERR_INTERNAL",
    DATABASE_ERROR = "ERR_DB_FAIL"
}

/**
 * Interface for Structured Error Objects
 */
export interface AppError {
    code: ErrorCode;
    name: string;
    message: string;
}

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */