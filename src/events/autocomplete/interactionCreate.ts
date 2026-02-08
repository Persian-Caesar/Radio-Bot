import { AutocompleteInteraction } from "discord.js";
import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import error from "../../utils/error";

export default async (client: DiscordClient, interaction: AutocompleteInteraction) => {
  try {
    if (!interaction.isAutocomplete())
      return;

    switch (interaction.commandName) {
      case "play": {
        const choices = Object.keys(radiostation)
          .map((a) => JSON.stringify({
            name: `${a}`,
            value: `${a}`
          }))
          .map(a => JSON.parse(a));

        const focusedValue = interaction.options.getFocused();
        const firstChoice = choices.filter(a => a.name.toLowerCase().startsWith(focusedValue.toLowerCase()));
        await interaction.respond(firstChoice.slice(0, 25)).catch(a => a);

        break;
      }
    }
  }

  catch (e) {
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