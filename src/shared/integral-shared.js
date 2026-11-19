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

export const typeNames = new Map([
    ["ILE", "Seeker"],
    ["LIE", "Entrepreneur"],
    ["IEE", "Advisor"],
    ["EIE", "Mentor"],  
    ["SLE", "Marshal"],
    ["LSE", "Administrator"],
    ["SEE", "Politician"],
    ["ESE", "Enthusiast"],
    ["ILI", "Critic"],
    ["LII", "Analyst"],
    ["IEI", "Lyricist"],
    ["EII", "Humanist"],
    ["SLI", "Craftsman"],
    ["LSI", "Inspector"],
    ["SEI", "Mediator"],
    ["ESI", "Guardian"],
]);

export const relationshipNames = new Map([
    ["ILE", "Identity"],
    ["LIE", "Quasi-identity"],
    ["IEE", "Rational Business/Irrational Kindred"],
    ["EIE", "Reverse Benefit"],
    ["SLE", "Rational Kindred/Irrational Business"],
    ["LSE", "Direct Benefit"],
    ["SEE", "Super-ego"],
    ["ESE", "Activation"],
    ["ILI", "Extinguishment"],
    ["LII", "Mirror"],
    ["IEI", "Rational Semi-duality/Irrational Mirage"],
    ["EII", "Direct Superevision"],
    ["SLI", "Rational Mirage/Irrational Semi-duality"],
    ["LSI", "Reverse Superevision"],
    ["SEI", "Duality"],
    ["ESI", "Conflict"],
]);

export const relationshipDescriptions = new Map([
    ["ILE", "Novelty, exploration, mutual learning, and searching for new solutions."],
    ["LIE", "Business involvement, competition, risk-taking, and a reduced sense of the partner's reliability."],
    ["IEE", "Giving useful advice, encouraging action, revealing abilities, and helping the partner find solutions."],
    ["EIE", "Emotional agitation, demands, motivation, involvement, and struggle for influence."],  
    ["SLE", "Effective joint action in extreme, critical, or high-pressure situations."],
    ["LSE", "Work, useful activity, concern with getting things done, and drawing the partner into productive action."],
    ["SEE", "Negotiating interests, mutually beneficial exchange, social support, and helping one another defend their interests."],
    ["ESE", "Emotional excitation, activity, fuss, stimulation, and increased involvement with one another."],
    ["ILI", "Mutual criticism, questioning the correctness of the partner's actions, negation, and cooling."],
    ["LII", "Analysis, mutual correction, examining decisions, and forecasting consequences."],
    ["IEI", "Periodic reconciliation, improved mood, hope for the future, emotional variability, and unstable work capacity."],
    ["EII", "Sympathy, gentle correction, educational influence, help, and trying to guide through personal example."],
    ["SLI", "Comfortable order, sensory care, practical cooperation, and relative emotional coolness."],
    ["LSI", "Monitoring, checking, fault-finding, accusations of unfairness, stubbornness, resistance, and control."],
    ["SEI", "Comfort, care, relaxation, accommodation, and peaceful resolution of tension."],
    ["ESI", "Internal tension, distrust, defensiveness, distancing, and protecting one's territory from the partner."],
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
