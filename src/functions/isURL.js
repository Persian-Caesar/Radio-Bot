/**
 *
 * @param {string} string
 * @returns {boolean}
 */
module.exports = function (string) {
  const regex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (regex.test(string)) {
    const isValidURL = fetch(string)
      .then(fetched => {
        fetched.ok
      });

    if (isValidURL)
      return true;

    else
      return false;
  }
  else
    return false;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */