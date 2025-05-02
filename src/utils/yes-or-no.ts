import {
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  ComponentType,
  Message
} from "discord.js";
import responseDelete from "./responseDelete";
import error from "./error";

export default async function yesOrNo(
  interaction: CommandInteraction | Message,
  message: Message,
  action: (btn: ButtonInteraction<CacheType>) => Promise<any>,
  time = 2 * 60 * 1000
) {
  try {
    const collector = message?.createMessageComponentCollector({ componentType: ComponentType.Button, maxUsers: 1, time })
    collector?.on("collect", async (btn) => {
      await btn.deferUpdate({ withResponse: true })
      if (btn.customId === "action-yes")
        return await action(btn)

      if (btn.customId === "action-no")
        return collector.stop("action stopped.")
    })
    collector?.on("end", async () => await responseDelete(interaction, interaction instanceof Message ? interaction : null))

    return;
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