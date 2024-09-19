const
  {
    ApplicationCommandType
  } = require("discord.js"),
  radio = require("../../functions/player"),
  response = require("../../functions/response");

module.exports = {
  name: "pause",
  description: "Pause the playback",
  category: "music",
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  defaultMemberPermissions: ["SendMessages"],
  bot_permissions: ["SendMessages", "EmbedLinks", "Connect", "Speak"],
  dmPermission: false,
  nsfw: false,
  only_owner: false,
  only_slash: true,
  only_message: true,

  /**
   * 
   * @param {import("discord.js").Client} client 
   * @param {import("discord.js").CommandInteraction} interaction 
   * @param {Array<string>} args 
   * @returns 
   */
  run: async (client, interaction, args) => {

    const memberChannelId = interaction.member?.voice?.channelId;
    if (!memberChannelId)
      return await response({
        content: "You need to join a voice channel first!",
        ephemeral: true
      });

    let queue;
    try {
      queue = new radio(interaction);
    } catch {
      return await sendError({
        interaction,
        isUpdateNeed: true,
        log: language.replies.noPlayerError
      });
    }

    const queueChannelId = queue?.data.channelId;
    if (memberChannelId !== queueChannelId)
      return await response({
        content: "You must be in the same voice channel as me!",
        ephemeral: true
      });

    queue.pause();

    return await response("Paused the playback.");
  },
};
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */