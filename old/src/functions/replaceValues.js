/**
 *
 * @param {string} string
 * @param {object} object
 * @returns {string}
 */
module.exports = function (string, object) {
  Object
    .keys(object)
    .forEach(a => string = string.replace(`{${a}}`, object[a]));

  return string;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */