import error from "./error";

export default async function repeatAction<T>(action: () => Promise<T>, maxAttempts = 3): Promise<T | undefined> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      return await action();
    } catch (e: any) {
      attempts++;
      if (attempts === maxAttempts)
        error(e);
    }
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