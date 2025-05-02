export { }

declare global {
    interface Array<T> {
        /**
         * @description
         * Return random item from array
         */
        random(): T;

        /**
         * @param size What size you want make an array chunk?
         * @description
         * Make a chunk about your array.
         * 
         * @example
         * [1, 2, 3, 4].chunk(2) => [[1,2], [3,4]]
         */
        chunk(size: number): T[][]
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