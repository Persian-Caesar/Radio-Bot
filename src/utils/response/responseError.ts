import {
  EmbedBuilder,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  MessageFlags
} from "discord.js";
import { Respondable } from "../../types/bot/discord";
import { LanguageDB } from "../../types/database/data-type";
import { AppError, ErrorColors } from "../../types/bot/handle-error";
import selectLanguage from "../selectLanguage";
import DiscordClient from "../../model/Client";
import repeatAction from "../repeatAction";
import EmbedData from "../../storage/EmbedData";
import logError from "../logError";
import config from "../../../config";

export default async function responseError(
  interaction: Respondable,
  log?: string,
  data?: InteractionReplyOptions | InteractionEditReplyOptions,
  app_error?: AppError
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
            .setColor(app_error ? ErrorColors[app_error.code].HexToNumber() : EmbedData.color.red.HexToNumber())
            .setFooter(
              {
                text: `${EmbedData.footer.footerText}${app_error ? " | " + app_error.message : ""}`,
                iconURL: EmbedData.footer.footerIcon
              }
            )
            .setTitle(`${app_error ? `${app_error.name} ${app_error.code}` : language.replies.error}`)
            .setDescription(app_error ? app_error.message : log!)
        ]
      };

    if ("editReply" in interaction && interaction.deferred)
      return await repeatAction(async () => await interaction.editReply(data as InteractionEditReplyOptions))

    else if ("reply" in interaction) {
      data.flags = MessageFlags.Ephemeral;
      return await repeatAction(async () => await interaction.reply(data as InteractionReplyOptions));
    }

    return;
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