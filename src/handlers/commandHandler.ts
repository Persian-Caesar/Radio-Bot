import { CommandType } from "../types/command/type";
import { readdirSync } from "fs";
import selectLanguage from "../utils/selectLanguage";
import DiscordClient from "../model/Client";
import logError from "../utils/logError";
import post from "../functions/post";

export default async (client: DiscordClient) => {
    try {
        await loadCommand(`${process.cwd()}/dist/src/commands`, client.commands);
        post(
            selectLanguage().replies.loadCommands.split("{cmdCount}")[0].green
            + (client.commands.size).toString().cyan
            + selectLanguage().replies.loadCommands.split("{cmdCount}")[1].green,
            "S"
        );
    }

    catch (e) {
        logError(e)
    }
};

// Function
async function loadCommand(dirname: string, object: Map<string, any>) {
    try {
        for (const dirs of readdirSync(dirname)) {
            const commandFiles = readdirSync(`${dirname}/${dirs}`)
                .filter(files => files.endsWith(".js"));

            for (const file of commandFiles) {
                const commandData = await import(`${dirname}/${dirs}/${file}`);
                const command: CommandType = commandData.default || commandData;
                if (!command.inactive)
                    object.set(command.data.name, command);

                else {
                    post(
                        `${selectLanguage().replies.loadCommandError} ${file}`,
                        "E",
                        "red",
                        "red"
                    );

                    continue;
                }
            }

        };

    }

    catch (e) {
        logError(e)
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