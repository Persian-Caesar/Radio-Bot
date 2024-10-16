const
  fs = require("fs"),
  error = require("./error"),
  post = require("./post"),
  config = require("../../config"),
  selectLanguage = require("./selectLanguage"),
  defaultLanguage = selectLanguage(config.source.default_language);

/**
 *
 * @param {string} dirname folder of commands path
 * @param {string} type place only_slash or only_message
 * @param {Map} object commands object like client.commands
 * @returns {void}
 */
module.exports = async function (dirname, type, object) {
  try {
    fs.readdirSync(`${dirname}`).forEach(async dirs => {
      const commandFiles = fs
        .readdirSync(`${dirname}/${dirs}`)
        .filter(files => files.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`${dirname}/${dirs}/${file}`);
        if (command[type])
          object.set(command.data.name, command);

        else {
          post(
            `${defaultLanguage.replies.loadCommandError} ${file}`,
            "E",
            "red",
            "redBright"
          );
          continue;
        }
      }
    });
  } catch (e) {
    error(e)
  }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */