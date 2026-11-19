import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

export const command = {
  data: new SlashCommandSubcommandBuilder()
    .setName("chart")
    .setDescription("Prints a chart of intertype relationships."),
  async execute(interaction) {
    const file = new AttachmentBuilder("public/media/chart.png");
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xf1c40f)
          .setTitle("SHS intertype relationship chart")
          .addFields({
            name: ":left_right_arrow: Types of relationships",
            value:
              "**ILE** - Identity\n" +
              "**LIE** - Quasi-identity\n" +
              "**IEE** - Rational Business/Irrational Kindred\n" +
              "**EIE** - Reverse Benefit\n" +
              "**SLE** - Rational Kindred/Irrational Business\n" +
              "**LSE** - Direct Benefit\n" +
              "**SEE** - Super-ego\n" +
              "**ESE** - Activation\n" +
              "**ILI** - Extinguishment\n" +
              "**LII** - Mirror\n" +
              "**IEI** - Rational Semi-duality/Irrational Mirage\n" +
              "**EII** - Direct Superevision\n" +
              "**SLI** - Rational Mirage/Irrational Semi-duality\n" +
              "**LSI** - Reverse Superevision\n" +
              "**SEI** - Duality\n" +
              "**ESI** - Conflict",
          })
          .setImage("attachment://chart.png"),
      ],
      files: [file],
    });
  },
};
