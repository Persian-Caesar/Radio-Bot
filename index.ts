/**
 * @license
  BSD 3-Clause License

  Copyright (c) 2026-2024, the respective contributors, as shown by Persian Caesar and Sobhan.SRZA (mr.sinre) file.

  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

  * Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {
    cpus,
    freemem,
    loadavg,
    totalmem
} from "os";
import {
    REST,
    Routes,
    version
} from "discord.js";
import {
    readdirSync,
    readFileSync
} from "fs";
import { PackageJson } from "./src/types/source";
import setupGlobalExtensions from "./src/functions/setupGlobalExtensions";
import selectLanguage from "./src/utils/selectLanguage";
import DiscordClient from "./src/model/Client";
import Database from "./src/database/Database";
import logError from "./src/utils/logError";
import config from "./config";
import post from "./src/functions/post";

// Adds custom methods to global prototypes (String, Array, Number)
setupGlobalExtensions();

const defaultLanguage = selectLanguage(config.discord.default_language);

// Add color to console messages.
import "colors";
import logger from "./src/functions/logger";

// Load discord client
const client = new DiscordClient();
const handle = readdirSync(__dirname + "/src/handlers").filter(file => file.endsWith(".js"));
const packageJSON: PackageJson = JSON.parse(readFileSync("./package.json", "utf8"));

// Login 
const main = async () => {
    try {
        post(
            "Welcome to ".cyan + (packageJSON.name).blue + "! | Version: ".cyan + (packageJSON.version).blue + "\n" +
            "Coded By ".cyan + ("Sobhan-SRZA").yellow + " & ".cyan + ("Persian Caesar").yellow + " With ".cyan + ("❤️").red + "\n" +
            `Discord: ${("Mr.Sinre").blue}` + " | ".cyan + `${("mr.sinre").blue}` + " | ".cyan + `${("https://dsc.gg/persian-caesar").blue}`,
            "W",
            "magenta",
            "cyan"
        );
        post(
            defaultLanguage.replies.loadBot,
            "S"
        );

        // Initialize QuickDB
        post("Loading database...", "S")
        const databaseFile = await import("./src/database/LoadQuickDB");
        const loadDB = databaseFile.default || databaseFile;
        const database = await loadDB();

        if (database) {
            client.db = new Database(database.db);
            post(
                "Database Is Successfully Activated!! (Type: " + database.dbType.yellow + ")".green,
                "S"
            );
            post("Database was loaded!".green, "D")
        }

        // Load Handlers 
        let amount = 0;
        for (const file of handle) {
            const handlerFile = await import(`./src/handlers/${file}`);
            const handler = handlerFile.default || handlerFile;
            await handler(client);
            amount++;
        }

        post(
            defaultLanguage.replies.loadHandlers.split("{count}")[0].green
            + (amount.toString()).cyan
            + defaultLanguage.replies.loadHandlers.split("{count}")[1].green,
            "S"
        );

        if (client.token) {
            await client
                .login(client.token)
                .then(async () => {
                    const { discord: { delete_commands, token } } = config
                    const commands = client.commands
                        .map(cmd => cmd.data);

                    const rest = new REST().setToken(token);

                    post(
                        defaultLanguage.replies.uploadSlashCmd.split("{count}")[0].green +
                        commands.length.toString().cyan +
                        defaultLanguage.replies.uploadSlashCmd.split("{count}")[1].green,
                        "S"
                    );

                    // Delete current (/)commands
                    if (delete_commands)
                        try {
                            const deleted = await rest.delete(
                                Routes.applicationCommands(client.user!.id)
                            ) as any;
                            post(`${String(deleted?.length).cyan}` + ` (/) commands successfully deleted.`.red, "S");
                        }

                        catch (e) {
                            post("Failed to delete (/) commands.".red, "E", "red", "red");
                            logError(e);
                        }

                    // Create (/)commands
                    try {
                        const created = await rest.put(
                            Routes.applicationCommands(client.user!.id),
                            { body: commands }
                        ) as any;

                        post(
                            defaultLanguage.replies.sucessUploadSlashCmd.split("{count}")[0].green +
                            created?.length.toString().cyan +
                            defaultLanguage.replies.sucessUploadSlashCmd.split("{count}")[1].green,
                            "S"
                        );
                    }

                    catch (e) {
                        post("Failed to create (/) commands.".red, "E", "red", "red");
                        logError(e);
                    }


                    // Log bot information
                    post(
                        defaultLanguage.replies.alertBotIsOnline.blue + `\n` +
                        defaultLanguage.replies.botIsOnline.split("{name}")[0].green +
                        client.user!.tag.cyan +
                        defaultLanguage.replies.botIsOnline.split("{name}")[1].green,
                        "S"
                    );
                    logger(
                        "Working Guilds: ".blue + `${client.guilds.cache.size.toLocaleString()} Servers`.cyan + `\n` +
                        "Watching Members: ".blue +
                        `${client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0).toLocaleString()} Members`.cyan + `\n` +
                        "Commands: ".blue +
                        `${client.commands.size}`.cyan + `\n` +
                        "Discord.js: ".blue + `v${version}`.cyan + `\n` +
                        "Node.js: ".blue + `${process.version}`.cyan + `\n` +
                        "Plattform: ".blue +
                        `${process.platform} ${process.arch} | ${cpus()[0].model} | ${String(loadavg()[0])}%`.cyan + `\n` +
                        "Memory: ".blue +
                        `${Math.round(((totalmem() - freemem()) / 1024 / 1024)).toLocaleString()}/${Math.round((totalmem() / 1024 / 1024)).toLocaleString()} MB | ${(((totalmem() - freemem()) / totalmem()) * 100).toFixed(2)}%`.cyan
                    );


                    // Add Slash Commands Id to Commands
                    Promise.all(
                        client.commands.map(async (command) => {
                            const
                                cmd = client.commands.get(command.data.name)!,
                                slashCommand = (await client.application!.commands.fetch({ cache: true, force: true }))
                                    .find(a => a.name === command.data.name);

                            return client.commands.set(
                                cmd.data.name,
                                {
                                    ...cmd,
                                    data: {
                                        ...cmd.data,
                                        id: slashCommand?.id
                                    }
                                }
                            );
                        })
                    )
                })
                .catch(e => {
                    if (e.stack.toLowerCase().includes("connect"))
                        post(
                            defaultLanguage.replies.ipError,
                            "E",
                            "red",
                            "red"
                        );

                    else
                        post(
                            defaultLanguage.replies.loginError,
                            "E",
                            "red",
                            "red"
                        );

                    logError(e);
                });

        }

        else
            post(defaultLanguage.replies.noTokenError, "E", "red", "red");

    }

    catch (e) {
        logError(e);

        await client.destroy();
        process.exit(1);
    }
};
void main();

// Load Anti Crash
if (client.config.source.anti_crash) {
    process.on("unhandledRejection", (e) => logError(e));
    process.on("rejectionHandled", (e) => logError(e));
    process.on("uncaughtException", (e) => logError(e));
    process.on("uncaughtExceptionMonitor", (e) => logError(e));
}

// Export client
export default client;

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */