import { Language } from "../types/interfaces";
import config from "../../config";

export default async function selectLanguage(language: string = config.source.default_language) {
  const lg_list = await import("../storage/languages.json")
  const lg_list_file = lg_list.default || lg_list;
  if (!language || typeof language === "undefined" || typeof language !== "string" || !(language in lg_list_file))
    language = config.source.default_language;

  const lg = await import(`../storage/locales/${language}.json`)
  const lg_file: Language = lg.default || lg;

  return lg_file;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */