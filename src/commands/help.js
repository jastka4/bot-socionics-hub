import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

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
                "</help:1265990525128020020> - Displays the list of available commands.\n" +
                "</integral calculate:1262564519499137124> - Calculates intertype relationship of provided types.\n" +
                "</integral chart:1266106879378194463> - Prints a chart of intertype relationships.",
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
      ephemeral: true,
    });
  }
}
