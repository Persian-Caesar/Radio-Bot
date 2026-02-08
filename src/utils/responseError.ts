import {
  EmbedBuilder,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  Message,
  MessageEditOptions,
  MessageFlags,
  MessageReplyOptions
} from "discord.js";
import { isBaseInteraction } from "./interactionTools";
import { Respondable } from "../types/types";
import { LanguageDB } from "../types/database";
import selectLanguage from "./selectLanguage";
import DiscordClient from "../model/Client";
import repeatAction from "./repeatAction";
import EmbedData from "../storage/EmbedData";
import config from "../../config";
import error from "./error";

export default async function responseError(
  interaction: Respondable,
  log?: string,
  data?: InteractionReplyOptions | InteractionEditReplyOptions | MessageReplyOptions,
  isUpdateNeed?: boolean,
  message?: Message
) {
  try {
    const
      db = (interaction.client as DiscordClient).db!,
      databaseNames = {
        language: `language.${interaction.guildId}`
      },
      lang = (await db.get<LanguageDB>(databaseNames.language)) || config.discord.default_language,
      language = selectLanguage(lang);

    if (!data)
      data = {
        embeds: [
          new EmbedBuilder()
            .setColor(EmbedData.color.red.HexToNumber())
            .setFooter(
              {
                text: EmbedData.footer.footerText,
                iconURL: EmbedData.footer.footerIcon
              }
            )
            .setTitle(language.replies.error)
            .setDescription(log!)
        ]
      };

    if (isBaseInteraction(interaction)) {
      if ("editReply" in interaction && interaction.deferred)
        return await repeatAction(async () => await interaction.editReply(data as InteractionEditReplyOptions))

      else if ("reply" in interaction) {
        data.flags = MessageFlags.Ephemeral;
        return await repeatAction(async () => await interaction.reply(data as InteractionReplyOptions));
      }

      return;
    }

    else
      if (isUpdateNeed && message)
        return await repeatAction(async () => await message.edit(data as MessageEditOptions));

      else
        return await repeatAction(async () => await interaction.reply(data as MessageReplyOptions));

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