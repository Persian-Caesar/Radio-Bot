import {
    AnySelectMenuInteraction,
    BaseInteraction,
    ButtonInteraction,
    CommandInteraction,
    ModalSubmitInteraction
} from "discord.js";

export type Respondable =
    | CommandInteraction
    | ModalSubmitInteraction
    | ButtonInteraction
    | AnySelectMenuInteraction
    | BaseInteraction;

export type StatusType = "Competing" | "Listening" | "Playing" | "Streaming" | "Watching" | "Custom";

export type StatusActivityType = (keyof typeof ActivityType);

export type BooleanString = "true" | "false";

export type PresenceStatus = "online" | "idle" | "dnd" | "offline";

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */