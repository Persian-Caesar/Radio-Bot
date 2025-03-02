/**
 * @license
  BSD 3-Clause License

  Copyright (c) 2024, the respective contributors, as shown by Persian Caesar and Sobhan.SRZA (mr.sinre) file.

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
// Packages 
require("dotenv").config();
const
  {
    Client,
    Collection,
    Partials,
    GatewayIntentBits
  } = require("discord.js"),
  clc = require("cli-color"),
  fs = require("fs"),
  post = require("./src/functions/post.js"),
  error = require("./src/functions/error.js"),
  config = require("./config.js"),
  selectLanguage = require("./src/functions/selectLanguage.js"),
  replaceValues = require("./src/functions/replaceValues.js"),
  defaultLanguage = selectLanguage(config.source.default_language),
  data = require("./package.json"),
  handle = fs
    .readdirSync("./src/handlers")
    .filter(file => file.endsWith(".js")),

  // Load discord.js Client
  client = new Client({
    intents: Object.keys(GatewayIntentBits).filter(a => isNaN(a) && a !== "GuildPresences"),
    partials: Object.keys(Partials).filter(a => isNaN(a))
  });

// Load Variables
client.config = require("./config.js");
client.token = config.discord.token;
client.commands = new Collection();
client.cooldowns = new Collection();

// Load Handlers
let count = 0;
post(
  clc.cyanBright(
    `Welcome to ${clc.blueBright(data.name)}! | Version: ${clc.blueBright(
      data.version
    )}`
  ) +
  "\n" +
  `Coded By ${clc.yellow("Sobhan-SRZA")} & ${clc.yellow(
    "Persian Caesar"
  )} With ${clc.redBright("❤️")}` +
  "\n" +
  `Discord: ${clc.blueBright("Mr.Sinre")} | ${clc.blueBright(
    "mr.sinre"
  )} | ${clc.blueBright("https://dsc.gg/persian-caesar")}`,
  "W",
  "magentaBright",
  "cyanBright"
);
post(
  defaultLanguage.replies.loadBot,
  "S",
  "yellowBright",
  "greenBright"
);
handle.forEach(file => {
  require(`./src/handlers/${file}`)(client)
  count += 1
});
post(
  replaceValues(defaultLanguage.replies.loadHandlers, {
    count: clc.cyanBright(count)
  }),
  "S",
  "yellowBright",
  "greenBright"
);

// Connent Bot To API
if (client.token)
  client.login(client.token).catch(e => {
    if (e.stack.toLowerCase().includes("connect"))
      post(
        defaultLanguage.replies.ipError,
        "E",
        "red",
        "redBright"
      );

    else
      post(
        defaultLanguage.replies.loginError,
        "E",
        "red",
        "redBright"
      );

    error(e);
  });

else
  post(
    defaultLanguage.replies.noTokenError,
    "E",
    "red",
    "redBright"
  );

// Load Anti Crash
if (config.source.anti_crash) {
  process.on("unhandledRejection", e => error(e));
  process.on("rejectionHandled", e => error(e));
  process.on("uncaughtException", e => error(e));
  process.on("uncaughtExceptionMonitor", e => error(e));
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */