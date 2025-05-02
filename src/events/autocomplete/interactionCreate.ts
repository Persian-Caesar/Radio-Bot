import { AutocompleteInteraction } from "discord.js";
import DiscordClient from "../../classes/Client";
import error from "../../utils/error";

export default async (client: DiscordClient, interaction: AutocompleteInteraction) => {
  try {
    if (!interaction.isAutocomplete())
      return;

    switch (interaction.commandName) {
      case "role": {
        const
          roles = interaction.guild?.roles?.cache?.toJSON(),
          mappedRoles = roles?.sort((a, b) => b.position - a.position)?.map(a => {
            return { name: a.name, value: a.position.toString() }
          }),
          focusedValue = interaction.options.getFocused(),
          firstChoice = mappedRoles?.filter(a => a.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

        if (firstChoice)
          return await interaction.respond(firstChoice.slice(0, 25)).catch(a => a);

        return;
      }
    }
  } catch (e: any) {
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