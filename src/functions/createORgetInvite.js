/**
 *
 * @param {import("discord.js").Guild} guild
  * @returns {import("discord.js").Invite}
 */
module.exports = async function (guild) {
  const inviteData = {
    reason: "Invite the developers",
    maxAge: 0
  };
  try {
    return await guild.invites?.cache?.find(a => a.inviterId === guild.client.user.id) ||
      await guild.widgetChannel?.createInvite(inviteData) ||
      await guild.rulesChannel?.createInvite(inviteData) ||
      await guildchannels?.cache
        ?.filter(a => a.type === 0 && a.viewable)
        ?.random(1)[0]
        ?.createInvite(inviteData) ||

      await guild.invites?.cache?.first();
  } catch {
    return null;
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