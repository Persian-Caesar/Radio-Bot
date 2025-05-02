const error = require("./error");

/**
 * 
 * @param {import("discord.js").Collection<string, import("../commands/Admins/setup")>} commands 
 * @param {import("../storage/locales/en.json")} language 
 * @param {string} value 
 * @param {string} prefix 
 * @returns {string}
 */
module.exports = async function (commands, language, value, prefix) {
  try {
    const description = [];
    await commands
      .filter(a => a.category === value)
      .forEach(async (command) => {
        const string = `**${command.only_slash ?
          `</${command.data.name}:${command.data?.id}>` : ""
          }${command.only_slash && command.only_message ?
            " | " : ""
          }${command.only_message ?
            `${prefix}${command.data.name} ${command.usage ? command.usage : ""}` : ""
          }${command.aliases && command.aliases.length > 0 ?
            `\n${language.commands.help.replies.aliases} [${command.aliases.map(a => `\`${a}\``).join(", ")}]` : ""
          }\n${language.commands.help.replies.description} \`${language.commands[command.data.name].description /* command.description */}\`**`;

        if (command.data.options && command.data.options.some(a => a.type === 1))
          await command.data.options
            .forEach((option) => {
              const string = `**${command.only_slash ?
                `</${command.data.name} ${option.name}:${command.data?.id}>` : ""
                }${command.only_slash && command.only_message ?
                  " | " : ""
                }${command.only_message ?
                  `${prefix}${command.data.name} ${option.name} ${command.usage ? command.usage : ""
                  }` : ""}${command.aliases && command.aliases.length > 0 ?
                    `\n${language.commands.help.replies.aliases} [${command.aliases.map(a => `\`${a}\``).join(", ")}]` : ""
                }\n${language.commands.help.replies.description} \`${language.commands[command.data.name].subCommands[option.name].description /* option.description */}\`**`;

              description.push(string);
            });

        else description.push(string);
      });

    return description.join("\n\n");
  } catch (e) {
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