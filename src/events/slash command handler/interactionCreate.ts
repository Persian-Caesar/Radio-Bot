import {
  Interaction,
  MessageFlags
} from "discord.js";
import checkCmdCooldown from "../../utils/checkCmdCooldown";
import selectLanguage from "../../utils/selectLanguage";
import checkCmdPerms from "../../utils/checkCmdPerms";
import DiscordClient from "../../model/Client";
import repeatAction from "../../utils/repeatAction";
import dbAccess from "../../database/dbAccess";
import logError from "../../utils/logError";
import config from "../../../config";

export default async (client: DiscordClient, interaction: Interaction) => {
  try {
    const guildId = interaction.guildId!;
    const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
    const language = selectLanguage(lang).replies;

    // Load Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      // Command Handler
      if (command) {
        if (interaction.channel!.isDMBased() && !command.data.dm_permission)
          return;

        // Filter Owners Commands
        if (command.only_owner)
          if (!client.config.discord.support.owners.includes(interaction.user.id))
            return await interaction.reply({
              flags: MessageFlags.Ephemeral,
              content: language.onlyOwner
            })

        // Check command perms
        if (interaction.guild)
          if (await checkCmdPerms(interaction, command))
            return;

        // Command cooldown
        if (await checkCmdCooldown(interaction, command))
          return;

        // Use flags conditionally
        const isEphemeralOption = interaction.options.getString("ephemeral") === "true";

        // 3 tries to defer reply
        let subcommand: string | null = null;
        if (interaction.options.data.length && interaction.options.data[0].type === 1)
          try {
            subcommand = interaction.options.getSubcommand();
          }

          catch { }

        const hasEphemeralOption = command.data.options?.some(option =>
          option.name === "ephemeral" ||
          (subcommand && option.options?.filter(sub => sub.name == subcommand)?.some(subOption => subOption.name === "ephemeral"))
        );

        if (
          hasEphemeralOption
        )
          await repeatAction(
            async () =>
              await interaction.deferReply({
                flags: isEphemeralOption ? MessageFlags.Ephemeral : undefined,
                withResponse: true
              })
          )


        // Count the new command
        await dbAccess.addTotalCommandsUsed(1);

        // Command Handler 
        return await command.run(client, interaction);
      }
    }
  }

  catch (e) {
    logError(e);
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