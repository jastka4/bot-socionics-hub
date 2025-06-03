import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { calculateIntegralTypeIndicator, getKeyByValue, isValid, typeIndicators } from "../../shared/integral-shared.js";

/**
 * Calculates the integral type of the provided types.
 *
 * The integral type is calculated by XOR'ing all the numeric values of the input types,
 * and then mapping the resulting number back to the corresponding Socionics type.
 *
 * @param {string[]} types - An array of types (e.g. ["ILE", "LIE", "SEI"]).
 * @returns {string|undefined} - The resulting integral type, or undefined if not found.
 */
function calculateIntegralType(types) {
  return getKeyByValue(typeIndicators, calculateIntegralTypeIndicator(types));
}

/**
 * Discord slash command that calculates the integral type of the provided Socionics types.
 *
 * Command usage example:
 * `/integral calculate types: LSI EIE LIE`
 */
export const command = {
  data: new SlashCommandSubcommandBuilder()
    .setName("calculate")
    .setDescription("Calculates intertype relationship of provided types.")
    .addStringOption((option) => option
      .setName("types")
      .setDescription(
        "List of types in the three-letter notation (separated by space)."
      )
      .setRequired(true)),
  async execute(interaction) {
    const rawValue = interaction.options.get("types").value.toUpperCase();

    if (isValid(rawValue)) {
      const listOfTypes = rawValue.split(" ");
      const result = calculateIntegralType(listOfTypes);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xf1c40f)
            .setTitle(result)
            .setDescription(listOfTypes.join(", ")),
        ],
      });
    } else {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xf1c40f)
            .setTitle("❗️ Wrong format ❗️")
            .setDescription(interaction.options.get("types").value)
            .addFields({
              name: "Usage example",
              value: "`/integral calculate 'types: LSI EIE LIE'`",
            }),
        ],
        ephemeral: true,
      });
    }
  }
}
