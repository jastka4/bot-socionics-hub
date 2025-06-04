import "dotenv/config"

/**
 * Regular expression that matches a string of Socionics types in three-letter notation.
 *
 * Valid types must follow the format of capital letters in combinations like:
 * LSI, EIE, ILE, SEE, etc.
 *
 * This pattern allows multiple valid types separated by spaces (e.g. "LSI ILE SEE").
 * Limited by the INTEGRAL_MAX_SUBSETS environment variable.
 *
 * @constant {RegExp}
 */
const typeNameRegex = new RegExp(`^(([LE][IS][IE]|[IS][LE][IE]) ?){1,${parseInt(process.env.INTEGRAL_MAX_SUBSETS)}}$`);

/**
* Map type to indicators (extroversion/introversion, intuition/sensing, logic/ethics, irrational/rational):
* - extroversion = 0,
* - introversion = 1,
* - intuition = 0,
* - sensing = 1,
* - logic = 0,
* - ethics = 1,
* - irrational = 0,
* - rational = 1.
*
* Example: EIE = ENFj = 0, 0, 1, 1 = 3
*
* @constant {Map<string, number>}
*/
export const typeIndicators = new Map([
    ["ILE", 0],
    ["LIE", 1],
    ["IEE", 2],
    ["EIE", 3],
    ["SLE", 4],
    ["LSE", 5],
    ["SEE", 6],
    ["ESE", 7],
    ["ILI", 8],
    ["LII", 9],
    ["IEI", 10],
    ["EII", 11],
    ["SLI", 12],
    ["LSI", 13],
    ["SEI", 14],
    ["ESI", 15],
]);

/**
 * Validates that all entries in a space-separated string are known Socionics types.
 * 
 * @param {string} input - Space-separated types.
 * @returns {boolean} - True if all types are valid and within the limit, false otherwise.
 */
export function isValid(input) {
    return typeNameRegex.test(input);
}

/**
 * Calculates an integral type of a list of socionic types.
 * 
 * @param {string[]} types - Array of socionic types (e.g. ["ILE", "LIE"]).
 * @returns {number} - The integral type represented by the numeric value (the indicator).
 */
export function calculateIntegralTypeIndicator(types) {
    return types.reduce((accumulator, type) => accumulator ^ typeIndicators.get(type), 0);
}

/**
 * Returns the first key in the specified map whose value matches the specified value.
 * 
 * @param {Map<any, any>} map - The map to search in.
 * @param {*} value - The value to look for.
 * @returns {any|undefined} The matching key, or undefined if no match was found.
 */
export function getKeyByValue(map, value) {
    const entry = [...map].find(([, val]) => val === value);
    return entry ? entry[0] : undefined;
}

/**
 * Generates all non-empty unique subsets of the provided types that result in the target integral type.
 * 
 * @param {string[]} types - Array of Socionic types.
 * @param {string} target - The target socionic type to match as integral.
 * @returns {string[][]} - An array of subsets (each is an array of types).
 */
export function getUniqueSubsets(types, target) {
    const combinations = [];
    const seen = new Set();

    for (let i = 1; i < (1 << types.length); i++) {
        const combination = [];
        for (let j = 0; j < types.length; j++) {
            if (i & (1 << j)) {
                combination.push(types[j]);
            }
        }

        if (calculateIntegralTypeIndicator(combination) === typeIndicators.get(target)) {
            const sorted = combination.slice().sort();
            const key = sorted.join(",");

            if (!seen.has(key)) {
                seen.add(key);
                combinations.push(combination);
            }
        }
    }

    return combinations.sort((a, b) => a.length - b.length);
}

/**
 * Formats a list of type subsets as a readable string for output.
 * 
 * @param {string[][]} subsets - Array of type subsets.
 * @returns {string[]} - A formatted array of all the subsets.
 */
export function format(subsets) {
    return subsets.map((combination, index) => `#${index + 1}: ${combination.join(", ")}`)
}
