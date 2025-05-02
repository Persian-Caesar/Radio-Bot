/**
 *
 * @param {Array} array
 * @param {number} chunkSize
 * @returns {Array<Array>}
 */
module.exports = function (array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize)
    result.push(array.slice(i, i + chunkSize));

  return result;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */