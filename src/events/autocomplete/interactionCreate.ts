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
        const choices: {
          name: string
          value: string
        }[] = Object.keys(radiostation)
          .map((station) => JSON.stringify({
            name: `${station}`,
            value: `${station}`
          }))
          .map(choice => JSON.parse(choice));

        const focusedValue = interaction.options.getFocused().toLowerCase();
        const firstChoice = choices.filter(choice => {
          const clearChoice = choice.name.toLowerCase();
          if (clearChoice.startsWith(focusedValue))
            return choice

          else if (clearChoice.includes(focusedValue))
            return choice

        });

        await interaction.respond(firstChoice.slice(0, 25)).catch(a => a);

        break;
      }

      case "guilds": {
        const guilds = await client.guilds.fetch()

        const choices = guilds.map((guild) => JSON.stringify({
          name: `${guild.name} (ID: ${guild.id})`,
          value: `${guild.id}`
        }))
          .map(choice => JSON.parse(choice));

        const focusedValue = interaction.options.getFocused().toLowerCase();
        const firstChoice = choices.filter(choice => {
          const clearChoice = choice.name.toLowerCase();
          if (clearChoice.startsWith(focusedValue))
            return choice

          else if (clearChoice.includes(focusedValue))
            return choice

        });

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