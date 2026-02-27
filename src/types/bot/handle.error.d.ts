/**
 * Numeric Error Codes for Persian Caesar Bot
 * Categorized by functionality for easier debugging.
 */
export enum ErrorCode {
    // 100-199: Permission & Access Errors
    MISSING_USER_PERMISSIONS = 101,
    MISSING_BOT_PERMISSIONS = 102,
    OWNER_ONLY_COMMAND = 103,
    INVALID_USER_INTERACTION = 104,
    WRONG_CHANNEL_EXECUTION = 105,
    GUILD_NOT_FOUND = 106,
    CHANNEL_NOT_FOUND = 107,

    // 200-299: Voice & Music Errors
    NOT_IN_VOICE = 201,
    CHANNEL_FULL = 202,
    NOT_VIEWABLE = 203,
    NOT_JOINABLE = 204,
    USER_DEAFENED = 205,
    CLIENT_MUTED = 206,
    NO_PLAYER_CONNECTED = 207,
    PLAYER_NOT_FOUND = 208,
    VOICE_CHANNEL_MISMATCH = 209,

    // 300-399: Command & Argument Errors
    MISSING_ARGUMENT = 301,
    INVALID_NUMBER = 302,
    INVALID_CHOICE = 303,
    COOLDOWN_ACTIVE = 304,
    COMMAND_DISABLED = 305,

    // 400-499: Database & External API Errors
    DATABASE_ERROR = 401,
    FETCH_FAILED = 402, // Useful for the MusicPlayer createStream

    // 500-599: General & Internal Errors
    INTERNAL_ERROR = 500,
    UNKNOWN_INTERACTION = 501
}

/**
 * Descriptive mapping for logs and debugging
 */
export const ErrorDetails: Record<ErrorCode, string> = {
    // 100-199: Permission & Access Errors
    [ErrorCode.MISSING_USER_PERMISSIONS]: "Missing User Permissions",
    [ErrorCode.MISSING_BOT_PERMISSIONS]: "Missing Bot Permissions",
    [ErrorCode.OWNER_ONLY_COMMAND]: "This command is restricted to the bot owner",
    [ErrorCode.INVALID_USER_INTERACTION]: "This interaction is not for you",
    [ErrorCode.WRONG_CHANNEL_EXECUTION]: "Command executed in the wrong channel (Panel Only)",
    [ErrorCode.GUILD_NOT_FOUND]: "The guild could not be found or identified",
    [ErrorCode.CHANNEL_NOT_FOUND]: "The specified channel could not be found",

    // 200-299: Voice & Music Errors
    [ErrorCode.NOT_IN_VOICE]: "User not in a voice channel",
    [ErrorCode.CHANNEL_FULL]: "Voice channel is full",
    [ErrorCode.NOT_VIEWABLE]: "Cannot view the voice channel",
    [ErrorCode.NOT_JOINABLE]: "Cannot join the voice channel",
    [ErrorCode.USER_DEAFENED]: "User is deafened",
    [ErrorCode.CLIENT_MUTED]: "Bot is muted in the guild",
    [ErrorCode.NO_PLAYER_CONNECTED]: "No music player is currently connected",
    [ErrorCode.PLAYER_NOT_FOUND]: "Music player object not found for this guild",
    [ErrorCode.VOICE_CHANNEL_MISMATCH]: "User and Bot are not in the same voice channel",

    // 300-399: Command & Argument Errors
    [ErrorCode.MISSING_ARGUMENT]: "Required parameter is missing",
    [ErrorCode.INVALID_NUMBER]: "The provided number is invalid",
    [ErrorCode.INVALID_CHOICE]: "The selected choice is not available",
    [ErrorCode.COOLDOWN_ACTIVE]: "Command cooldown in progress",
    [ErrorCode.COMMAND_DISABLED]: "This command has been disabled",

    // 400-499: Database & External API Errors
    [ErrorCode.DATABASE_ERROR]: "Database connection or query failed",
    [ErrorCode.FETCH_FAILED]: "Failed to fetch external resource/stream",

    // 500-599: General & Internal Errors
    [ErrorCode.INTERNAL_ERROR]: "An unexpected internal error occurred",
    [ErrorCode.UNKNOWN_INTERACTION]: "The interaction could not be found or has expired"
};

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