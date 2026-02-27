import { AttachmentBuilder, EmbedBuilder, WebhookClient, WebhookMessageCreateOptions } from "discord.js";
import EmbedData from "../storage/EmbedData";
import config from "../../config";
import post from "../functions/post";


/**
 * Sends application errors to the configured Discord webhook.
 * Falls back to console logging if webhook logging is disabled.
 */
export default async function logError(rawError: unknown): Promise<void> {
  try {
    // Normalize unknown errors into Error instance
    const error =
      rawError instanceof Error
        ? rawError
        : new Error(typeof rawError === "string" ? rawError : JSON.stringify(rawError));

    const webhookUrl = config.discord.support.webhook.bugs;
    const loggerEnabled = config.source.logger;

    // Fallback to console if webhook logging is disabled
    if (!loggerEnabled || !webhookUrl) {
      console.error(error);
      return;
    }

    const webhook = new WebhookClient({ url: webhookUrl });
    const timestamp = Math.floor(Date.now() / 1000);
    const stack = error.stack ?? "No stack trace available";

    const baseData: WebhookMessageCreateOptions = {
      username: config.discord.support.webhook.username,
      avatarURL: config.discord.support.webhook.avatar
    };

    /**
     * Builds the error embed.
     */
    const buildEmbed = () => {
      const embed = new EmbedBuilder()
        .setColor(EmbedData.color.theme.HexToNumber())
        .setTitle(`${EmbedData.emotes.default.error} | An error occurred`)
        .setAuthor({ name: error.message })
        .setFooter({
          text: EmbedData.footer.footerText,
          iconURL: EmbedData.footer.footerIcon
        })
        .setDescription(`\`\`\`js\n${stack.slice(0, 4000)}\`\`\``)
        .addFields(
          {
            name: `${EmbedData.emotes.default.entry} | Name`,
            value: error.name,
            inline: true
          },
          {
            name: `${EmbedData.emotes.default.clock} | Timestamp`,
            value: `<t:${timestamp}:D> | <t:${timestamp}:R>`,
            inline: true
          }
        );

      // Optional metadata fields
      if ((error as any).code) {
        embed.addFields({
          name: `${EmbedData.emotes.default.prohibited} | Code`,
          value: String((error as any).code),
          inline: true
        });
      }

      if ((error as any).status) {
        embed.addFields({
          name: `${EmbedData.emotes.default.globe} | HTTP Status`,
          value: String((error as any).status),
          inline: true
        });
      }

      return embed;
    };

    // If stack exceeds embed limits → send as file
    if (stack.length > 4000) {
      await webhook.send({
        ...baseData,
        content:
          `**${error.name}**\n` +
          `Code: \`${(error as any).code ?? "N/A"}\`\n` +
          `HTTP: \`${(error as any).status ?? "N/A"}\`\n` +
          `Timestamp: <t:${timestamp}:D> | <t:${timestamp}:R>`,
        files: [
          new AttachmentBuilder(Buffer.from(stack), {
            name: "error_stack.txt"
          })
        ]
      });

      return;
    }

    // Normal embed send
    await webhook.send({
      ...baseData,
      embeds: [buildEmbed()]
    });
  }

  catch (loggerFailure) {
    // Critical fallback if webhook logger itself fails
    post("Webhook error logger failed.", "E", "red", "red");
    console.error("Logger Failure:", loggerFailure);
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