const
  clc = require("cli-color"),
  error = require("./error");

/**
 *
 * @param {any} data
 * @returns {void}
 */
module.exports = function (data) {
  try {
    const logstring = `${clc.yellowBright(`[G]〢┃  ${clc.greenBright("Perisan Caesar")}`)}${clc.magenta(` 〢 `)}`;
    if (typeof data == "string")
      console.log(
        logstring +
        data
          .split("\n")
          .map(d => clc.green(`${d}`))
          .join(`\n${logstring}`)
      );

    else if (typeof data == "object")
      console.log(logstring + clc.green(JSON.stringify(data, null, 3)));

    else if (typeof data == "boolean")
      console.log(logstring + clc.cyan(data));

    else
      console.log(logstring + data);
  } catch (e) {
    error(e);
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