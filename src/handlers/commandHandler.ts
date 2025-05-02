import selectLanguage from "../utils/selectLanguage";
import { CommandType } from "../types/interfaces";
import { readdirSync } from "fs";
import DiscordClient from "../classes/Client";
import error from "../utils/error";
import post from "../functions/post";

export default async (client: DiscordClient) => {
    try {
        const commandTypes = ["only_message", "only_slash"] as const;
        commandTypes.forEach(async (type) => {
            await loadCommand(`${process.cwd()}/dist/src/commands`, type, client.commands);
            post(
                (await selectLanguage()).replies.loadCommands.replaceValues({
                    cmdCount: (client.commands.filter(a => a[type]).size).toString().cyan,
                    type: type.replace("only_", "").toCapitalize()
                }), "S");
        });
    } catch (e: any) {
        error(e)
    }
};

// Function
async function loadCommand(dirname: string, type: "only_slash" | "only_message", object: Map<string, any>) {
    try {
        for (const dirs of readdirSync(dirname)) {
            const commandFiles = readdirSync(`${dirname}/${dirs}`)
                .filter(files => files.endsWith(".js"));

            for (const file of commandFiles) {
                const commandData = await import(`${dirname}/${dirs}/${file}`);
                const command: CommandType = commandData.default || commandData;
                if (command[type])
                    object.set(command.data.name, command);

                else {
                    post(
                        `${type.replace("only_", "").toCapitalize()} ${(await selectLanguage()).replies.loadCommandError} ${file}`,
                        "E",
                        "red",
                        "red"
                    );
                    continue;
                }
            }

        };

    } catch (e: any) {
        error(e)
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