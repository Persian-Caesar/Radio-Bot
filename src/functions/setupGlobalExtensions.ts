/**
 * setupGlobalExtensions.ts
 * Adds custom methods to global prototypes (String, Array, Number)
 * This function should be called once at startup (in index.ts)
 */

export default function () {
    // Adding "toCapitalize" method to String
    if (!String.prototype.toCapitalize) {
        String.prototype.toCapitalize = function (): string {
            return String(this).toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        };
    }

    // Adding "replaceValues" method to String
    if (!String.prototype.replaceValues) {
        String.prototype.replaceValues = function (object: Record<string, any>): string {
            let string = String(this);
            Object.keys(object).forEach(key => {
                string = string.replace(new RegExp(`\\{${key}\\}`, 'g'), object[key]);
            });
            return string;
        };
    }

    // Adding "HexToNumber" method to String
    if (!String.prototype.HexToNumber) {
        String.prototype.HexToNumber = function (): number {
            return parseInt(this.replace("#", ""), 16);
        };
    }

    // Adding "convertToPersianString" method to String
    if (!String.prototype.convertToPersianString) {
        String.prototype.convertToPersianString = function (): string {
            return this.replace(/\d+/g, (match) => {
                const number = parseInt(match, 10);
                return number.toLocaleString("fa-IR");
            });
        };
    }

    // Adding "random" method to Array
    if (!Array.prototype.random) {
        Array.prototype.random = function () {
            const array = Array.from(this);
            return array[Math.floor(Math.random() * array.length)];
        };
    }

    // Adding "chunk" method to Array
    if (!Array.prototype.chunk) {
        Array.prototype.chunk = function (size) {
            const array = Array.from(this);
            const result = [];
            for (let i = 0; i < array.length; i += size)
                result.push(array.slice(i, i + size));

            return result;
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