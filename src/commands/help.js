import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

/**
 * Slash command definition for the "help" subcommand.
 * 
 * This command prints all available commands and some links to theory.
 * 
 * Command usage example:
 * `/help`
 */
export const command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays the list of available commands."),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xf1c40f)
          .setTitle("Help")
          .addFields(
            {
              name: ":computer: Commands",
              value:
                "</help:1368693827489234956> - Displays the list of available commands.\n" +
                "</integral calculate:1368190028907544728> - Calculates intertype relationship of provided types.\n" +
                "</integral chart:1368190028907544728> - Prints a chart of intertype relationships.\n" +
                "</integral combinations get:1368190028907544728> - Finds all proper subsets of types that combine into the specified target integral type.\n" +
                "</integral combinations subset:1368190028907544728> - Finds all proper subsets of the provided types that combine into the specified target integral type.",
            },
            {
              name: "_ _",
              value: "_ _",
            },
            {
              name: ":memo: Theory",
              value:
                "[Internal relations in a group as a reflection of its integral type - Varlawend's Blog](https://varlawend.blogspot.com/2018/12/introverted-socionics.html)\n" +
                "[Intertype relations in a nutshell (jokingly :partying_face:) - Reddit](https://www.reddit.com/r/Socionics/comments/t6d91v/intertype_relations_in_a_nutshell_triggered/)\n" +
                "[Intertype relations - Wikisocion](https://wikisocion.github.io/content/intertype.html)",
            }
          ),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
