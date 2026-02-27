import {
  EmbedBuilder,
  Interaction,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  time,
  WebhookClient,
  LabelBuilder
} from "discord.js";
import selectLanguage from "../../components/selectLanguage";
import DiscordClient from "../../model/Client";
import GetInvite from "../../components/GetInvite";
import EmbedData from "../../storage/EmbedData";
import dbAccess from "../../database/dbAccess";
import logError from "../../components/logError";
import config from "../../../config";

export default async (client: DiscordClient, interaction: Interaction) => {
  try {
    const guildId = interaction.guildId!;
    const lang = (await dbAccess.getLanguage(guildId)) || config.discord.default_language;
    const language = selectLanguage(lang);
    const defaultLanguage = selectLanguage(config.discord.default_language);

    if (interaction.isButton()) {
      if (interaction.customId === "reportButton") {
        const modal = new ModalBuilder()
          .setTitle(language.replies.modals.reportModalTitle)
          .setCustomId("reportModal")
          .addLabelComponents(
            new LabelBuilder()
              .setLabel(language.replies.modals.reportModalLabel)
              .setTextInputComponent(
                new TextInputBuilder()
                  .setCustomId("reportModalMessage")
                  .setPlaceholder(language.replies.modals.reportModalPlaceholder)
                  .setStyle(TextInputStyle.Paragraph)
              )
          );

        return await interaction.showModal(modal);
      };

    }

    else if (interaction.isModalSubmit()) {
      if (interaction.customId === "reportModal") {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const
          webhook = new WebhookClient({ url: config.discord.support.webhook.report }),
          message = interaction.fields.getTextInputValue("reportModalMessage");

        if (interaction.guild) {
          const
            invite = await GetInvite(interaction.guild);

          let owner;
          try {
            owner = (await interaction.guild.fetchOwner()).user
              || client.users.cache.get(interaction.guild.ownerId);
          }

          catch { }

          const guildCreatedAt = Date.parse(interaction.guild.createdAt.toString()) / 1000;

          const embed = new EmbedBuilder()
            .setAuthor(
              {
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: true })
              }
            )
            .setColor(EmbedData.color.theme.HexToNumber())
            .setDescription(
              language.replies.modals.reportEmbedDescription.replaceValues({
                message: message.toString().length < 3900 ? message.toString() : message.toString().slice(0, 3900) + " and more...",
                user: `${interaction.user} | \`${interaction.user?.tag}\` | \`${interaction.user?.id}\``
              })

            )
            .addFields(
              [
                {
                  name: `${EmbedData.emotes.default.owner}| ${defaultLanguage.replies.guild.owner}`,
                  value: `${EmbedData.emotes.default.reply} **${owner} | \`${owner?.tag}\` | \`${owner?.id}\`**`,
                  inline: false
                },
                {
                  name: `${EmbedData.emotes.default.server}| ${defaultLanguage.replies.guild.guild}`,
                  value: `${EmbedData.emotes.default.reply} **${invite ? `[${interaction.guild.name}](${invite.url})` : `${interaction.guild.name}`} | \`${interaction.guild.id}\` | \`${interaction.guild.memberCount}\` Members**`,
                  inline: false
                },
                {
                  name: `${EmbedData.emotes.default.date}| ${defaultLanguage.replies.guild.createdAt}`,
                  value: `${EmbedData.emotes.default.reply} **${time(guildCreatedAt, "D")} | ${time(guildCreatedAt, "R")}**`,
                  inline: false
                }
              ]
            )
            .setThumbnail(interaction.guild.iconURL({ forceStatic: true }))
            .setTimestamp();

          await webhook.send({
            embeds: [embed],
            username: interaction.user.displayName,
            avatarURL: interaction.user.displayAvatarURL({ forceStatic: true })
          });
        }

        else {
          const embed = new EmbedBuilder()
            .setColor(EmbedData.color.theme.HexToNumber())
            .setDescription(
              language.replies.modals.reportEmbedDescription.replaceValues({
                message: message.toString().length < 3900 ? message.toString() : message.toString().slice(0, 3900) + " and more...",
                user: `${interaction.user} | \`${interaction.user?.tag}\` | \`${interaction.user?.id}\``
              })

            )
            .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: true }))
            .setTimestamp();

          await webhook.send({
            embeds: [embed],
            username: interaction.user.displayName,
            avatarURL: interaction.user.displayAvatarURL({ forceStatic: true })
          });
        }

        return await interaction.editReply({
          content: language.replies.modals.sendReport
        });
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