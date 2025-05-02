const
  fs = require("fs"),
  clc = require("cli-color"),
  post = require("../functions/post"),
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
  let amount = 0;
  fs.readdirSync(`${process.cwd()}/src/events`).forEach(dirs => {
    const events = fs.readdirSync(`${process.cwd()}/src/events/${dirs}`).filter(files => files.endsWith(".js"));
    for (const file of events) {
      const event = require(`${process.cwd()}/src/events/${dirs}/${file}`);
      client.on(file.split(".")[0], event.bind(null, client));
      amount++;
    };
  });
  post(
    replaceValues(defaultLanguage.replies.loadEvents, {
      count: clc.cyanBright(amount)
    }),
    "S",
    "yellowBright",
    "greenBright"
  );
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */