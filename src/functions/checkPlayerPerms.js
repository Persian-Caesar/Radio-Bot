const
  error = require("./error"),
  selectLanguage = require("./selectLanguage"),
  config = require("../../config"),
  sendError = require("./sendError");

/**
 *
 * @param {import("discord.js").CommandInteraction} interaction
 * @returns {import("discord.js").InteractionResponse}
 */
module.exports = async function (interaction) {
  try {
    const
      db = interaction.client.db,
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang),
      member = interaction.guild.members.cache.get(interaction.member.id),
      channel = interaction.member?.voice?.channel;

    if (!channel) {
      await sendError({
        isUpdateNeed: true,
        interaction,
        log: language.replies.noChannelError
      });

      return true;
    }

    if (!channel.viewable) {
      await sendError({
        isUpdateNeed: true,
        interaction,
        log: language.replies.noPermToView
      });

      return true;
    };

    if (!channel.joinable) {
      await sendError({
        isUpdateNeed: true,
        interaction,
        log: language.replies.noPermToConnect
      });

      return true;
    }

    if (channel.full) {
      await sendError({
        isUpdateNeed: true,
        interaction,
        log: language.replies.channelFull
      });

      return true;
    }

    if (member.voice.deaf) {
      await sendError({
        isUpdateNeed: true,
        interaction,
        log: language.replies.userDeaf
      });

      return true;
    };

    // if (channel.id !== radio.data.channelId) {
    //   await sendError({
    //     isUpdateNeed: true,
    //     interaction,
    //     log: language.replies.notMatchedVoice
    //   });

    //   return true;
    // }

    if (interaction.guild.members.me?.voice?.mute) {
      await sendError({
        isUpdateNeed: true,
        interaction,
        log: language.replies.clientMute
      });

      return true;
    }

    return false;
  } catch (e) {
    error(e);
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