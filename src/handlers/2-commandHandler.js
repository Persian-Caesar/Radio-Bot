const
    clc = require("cli-color"),
    post = require("../functions/post"),
    loadCommand = require("../functions/loadCommand"),
    firstUpperCase = require("../functions/firstUpperCase"),
    error = require("../functions/error"),
    config = require("../../config"),
    selectLanguage = require("../functions/selectLanguage"),
    replaceValues = require("../functions/replaceValues"),
    defaultLanguage = selectLanguage(config.source.default_language);

/**
 * 
 * @param {import("discord.js").Client} client 
 * @returns {void}
 */
module.exports = async (client) => {
    try {
        ["only_message", "only_slash"].forEach((type) => {
            loadCommand(`${process.cwd()}/src/commands`, type, client.commands);
            post(
                replaceValues(defaultLanguage.replies.loadCommands, {
                    cmdCount: clc.cyanBright(client.commands.filter(a => a[type]).size),
                    type: firstUpperCase(type.replace("only_", ""))
                }),
                "S"
            );
        });
    } catch (e) {
        error(e)
    }
};
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */