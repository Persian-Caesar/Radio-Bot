const
  {
    QuickDB
  } = require("quick.db"),
  clc = require("cli-color"),
  error = require("../functions/error"),
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
  try {
    let driver;
    switch (config.source.database.type) {
      case "sql": {
        const {
          SqliteDriver
        } = require("quick.db");
        driver = new SqliteDriver();
      } break;

      case "mysql": {
        const {
          MySQLDriver
        } = require("quick.db");
        driver = new MySQLDriver(config.source.database.mysql)
      } break;

      case "json": {
        const {
          JSONDriver
        } = require("quick.db");
        driver = new JSONDriver();
      } break;

      case "mongodb": {
        const {
          MongoDriver
        } = require("quickmongo");
        driver = new MongoDriver(config.source.database.mongoURL);
        await driver.connect();
      } break;
    };

    const db = new QuickDB({
      driver
    });
    await db.init();
    client.db = db;
    post(
      replaceValues(defaultLanguage.replies.loadDatabase, {
        type: config.source.database.type.toLocaleUpperCase()
      }),
      "S"
    );
  } catch (e) {
    post(
      `${clc.red(
        replaceValues(defaultLanguage.replies.databaseError, {
          type: config.source.database.type.toLocaleUpperCase()
        })
      )}`,
      "E",
      "red",
      "redBright"
    );
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