import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";

/*
Map type to indicators (extroversion/introversion, intuition/sensing, logic/ethics, irrational/rational):
- extroversion = 0,
- introversion = 1,
- intuition = 0,
- sensing = 1,
- logic = 0,
- ethics = 1,
- irrational = 0,
- rational = 1.

Example: EIE = ENFj = 0, 0, 1, 1 = 3
*/
const typeIndicators = new Map([
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

function getKeyByValue(map, value) {
  return [...map].find(([key, val]) => val === value)[0];
}

function findIntegralType(listOfTypes) {
  return listOfTypes.reduce((accumulator, currentValue) => {
    const integralTypeIdicator =
      typeIndicators.get(accumulator) ^ typeIndicators.get(currentValue);
    return getKeyByValue(typeIndicators, integralTypeIdicator);
  });
}

export const command = {
  data: new SlashCommandSubcommandBuilder()
    .setName("calculate")
    .setDescription("Calculates intertype relationship of provided types.")
    .addStringOption((option) => option
      .setName("types")
      .setDescription(
        "List of types in the three-letter notation (separated by space)."
      )
      .setRequired(true)
    ),
  async execute(interaction) {
    const rawValue = interaction.options.get("types").value.toUpperCase();
    const regex = /^(([LE][IS][IE]|[IS][LE][IE]) ?)*$/;

    if (regex.test(rawValue)) {
      const listOfTypes = rawValue.split(" ");
      const result = findIntegralType(listOfTypes);

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
              value: "`/calculate LSI EIE LIE`",
            }),
        ],
      });
    }
  }
}
