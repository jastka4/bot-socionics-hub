const {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
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
              "**ILE** - identity\n" +
              "**LIE** - quasi-identity\n" +
              "**IEE** - kindred\n" +
              "**EIE** - reverse benefit\n" +
              "**SLE** - business\n" +
              "**LSE** - direct benefit\n" +
              "**SEE** - super-ego\n" +
              "**ESE** - activation\n" +
              "**ILI** - extinguishment\n" +
              "**LII** - mirror\n" +
              "**IEI** - mirage\n" +
              "**EII** - direct superevision\n" +
              "**SLI** - semi-duality\n" +
              "**LSI** - reverse superevision\n" +
              "**SEI** - duality\n" +
              "**ESI** - conflict",
          })
          .setImage("attachment://chart.png"),
      ],
      files: [file],
    });
  },
};
