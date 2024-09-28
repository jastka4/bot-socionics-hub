const {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { ButtonPaginationBuilder } = require("@thenorthsolution/djs-pagination");

const qs = require("qs");

const types = [
  { name: "EIE", value: "EIE" },
  { name: "EII", value: "EII" },
  { name: "ESE", value: "ESE" },
  { name: "ESI", value: "ESI" },
  { name: "IEE", value: "IEE" },
  { name: "IEI", value: "IEI" },
  { name: "ILE", value: "ILE" },
  { name: "ILI", value: "ILI" },
  { name: "LIE", value: "LIE" },
  { name: "LII", value: "LII" },
  { name: "LSE", value: "LSE" },
  { name: "LSI", value: "LSI" },
  { name: "SEE", value: "SEE" },
  { name: "SEI", value: "SEI" },
  { name: "SLE", value: "SLE" },
  { name: "SLI", value: "SLI" },
];

function createEmbed(title, description, fields, footerText) {
  return new EmbedBuilder()
  .setAuthor({
    name: "Socionics Hub",
    url: "https://socionics-hub.vercel.app/",
    iconURL:
      "https://vpfxlag2bwarpbmr.public.blob.vercel-storage.com/socionics-hub-logo-9mDyHDaKSJyIaNVticAioTJOFB1t9Z.png",
  })
  .setTitle(title)
  .setDescription(description)
  .addFields(fields)
  .setColor(0xf1c40f)
  .setFooter({
    text: footerText,
    iconURL:
      "https://vpfxlag2bwarpbmr.public.blob.vercel-storage.com/socionics-hub-logo-9mDyHDaKSJyIaNVticAioTJOFB1t9Z.png",
  })
  .setTimestamp()
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profiles")
    .setDescription("Returns profiles for the selected school and options.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("shs")
        .setDescription("Returns SHS profiles for selected options.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The SHS type to search for.")
            .addChoices(types)
        )
        .addStringOption((option) =>
          option
            .setName("subtype")
            .setDescription("The primary subtype to search for.")
            .setMinLength(1)
            .setMaxLength(4)
        )
        .addStringOption((option) =>
          option
            .setName("accentuation")
            .setDescription("The accentuation to search for.")
            .addChoices(
              { name: "F", value: "F" },
              { name: "S", value: "S" },
              { name: "P", value: "P" },
              { name: "L", value: "L" },
              { name: "E", value: "E" },
              { name: "R", value: "R" },
              { name: "I", value: "I" },
              { name: "T", value: "T" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("shift")
            .setDescription("The shift to search for.")
            .addChoices(types)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("scs")
        .setDescription("Returns SCS profiles for selected options.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The SCS type to search for.")
            .setRequired(true)
            .addChoices(types)
        )
    ),
  async execute(interaction) {
    const school = interaction.options.getSubcommand();
    var query = {};
    var typeDetails = [];

    switch (school) {
      case "shs":
        const shsType = interaction.options.get("type");
        const shsSubtype = interaction.options.get("subtype");
        const shsAccentuation = interaction.options.get("accentuation");
        const shsShift = interaction.options.get("shift");

        if (shsType) {
          query = { ...query, "SHS.type": { equals: `${shsType.value}` } };
          typeDetails.push(`Type: ${shsType.value}`);
        }
        if (shsSubtype) {
          const regex = /^[DCNH]{1,4}$/;
          const rawValueSubtype = shsSubtype.value.toUpperCase();
          if (regex.test(rawValueSubtype)) {
            query = {
              ...query,
              "SHS.subtype": { all: `${rawValueSubtype.split("").join(",")}` },
            };
            typeDetails.push(`Subtype: ${rawValueSubtype}`);
          } else {
            await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    name: "Socionics Hub",
                    url: "https://socionics-hub.vercel.app/",
                    iconURL:
                      "https://vpfxlag2bwarpbmr.public.blob.vercel-storage.com/socionics-hub-logo-9mDyHDaKSJyIaNVticAioTJOFB1t9Z.png",
                  })
                  .setTitle("❗️ Wrong subtype format ❗️")
                  .setDescription(interaction.options.get("subtype").value)
                  .addFields({
                    name: "Accepted formats",
                    value: "`C`\n`CN`\n`CND`\n`CNDH`",
                  })
                  .setColor(0xf1c40f)
                  .setFooter({
                    text: "Error",
                    iconURL:
                      "https://vpfxlag2bwarpbmr.public.blob.vercel-storage.com/socionics-hub-logo-9mDyHDaKSJyIaNVticAioTJOFB1t9Z.png",
                  })
                  .setTimestamp(),
              ],
            });
            return;
          }
        }
        if (shsAccentuation) {
          query = {
            ...query,
            "SHS.accentuation": { equals: `${shsAccentuation.value}` },
          };
          typeDetails.push(`Accentuation: ${shsAccentuation.value}`);
        }
        if (shsShift) {
          query = { ...query, "SHS.shift": { equals: `${shsShift.value}` } };
          typeDetails.push(`Shift: ${shsShift.value}`);
        }
        break;
      case "scs":
        const scsType = interaction.options.get("type");

        if (scsType) {
          query = { ...query, "SCS.type": { equals: `${scsType.value}` } };
          typeDetails.push(`Type: ${scsType.value}`);
        }
        break;
    }

    const stringifiedQuery = qs.stringify(
      {
        limit: 10,
        where: {
          and: [query],
        },
      },
      { addQueryPrefix: true }
    );

    console.log(stringifiedQuery);
    const data = await fetch(
      new URL(`api/profiles${stringifiedQuery}`, process.env.SOCIONICS_HUB)
    ).then((response) => response.json());

    if (data.totalDocs == 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: "Socionics Hub",
              url: "https://socionics-hub.vercel.app/",
              iconURL:
                "https://vpfxlag2bwarpbmr.public.blob.vercel-storage.com/socionics-hub-logo-9mDyHDaKSJyIaNVticAioTJOFB1t9Z.png",
            })
            .setTitle(school.toUpperCase())
            .setDescription(
              `${typeDetails.join("\n")}\n\n**No results found!**`
            )
            .setColor(0xf1c40f)
            .setFooter({
              text: `Page ${data.page}/${data.totalPages}`,
              iconURL:
                "https://vpfxlag2bwarpbmr.public.blob.vercel-storage.com/socionics-hub-logo-9mDyHDaKSJyIaNVticAioTJOFB1t9Z.png",
            })
            .setTimestamp(),
        ],
      });
      return;
    }

    var names = [];
    var shsTypes = [];
    var scsTypes = [];
    for (const profile of data.docs) {
      names.push(profile.name);

      if (profile.SHS.type) {
        var temp = [
          profile.SHS.type,
          profile.SHS.subtype.join(""),
          profile.SHS.accentuation.join(""),
        ]
          .filter(Boolean)
          .join("-");
        if (profile.SHS.shift) {
          temp += ` (shift to ${profile.SHS.shift})`;
        }
        shsTypes.push(temp);
      } else {
        shsTypes.push("---");
      }

      if (profile.SCS.type) {
        scsTypes.push(profile.SCS.type);
      } else {
        scsTypes.push("---");
      }
    }

    const pagination = new ButtonPaginationBuilder();
    pagination.addPages(
      new EmbedBuilder()
        .setAuthor({
          name: "Socionics Hub",
          url: "https://socionics-hub.vercel.app/",
          iconURL:
            "https://vpfxlag2bwarpbmr.public.blob.vercel-storage.com/socionics-hub-logo-9mDyHDaKSJyIaNVticAioTJOFB1t9Z.png",
        })
        .setTitle(school.toUpperCase())
        .setDescription(typeDetails.join("\n"))
        .addFields(
          {
            name: "Name",
            value: names.join("\n"),
            inline: true,
          },
          {
            name: "SHS",
            value: shsTypes.join("\n"),
            inline: true,
          },
          {
            name: "SCS",
            value: scsTypes.join("\n"),
            inline: true,
          }
        )
        .setColor(0xf1c40f)
        .setFooter({
          text: `Page ${data.page}/${data.totalPages}`,
          iconURL:
            "https://vpfxlag2bwarpbmr.public.blob.vercel-storage.com/socionics-hub-logo-9mDyHDaKSJyIaNVticAioTJOFB1t9Z.png",
        })
        .setTimestamp()
    );

    for (let i = 1; i < data.totalPages; i++) {
      pagination.addPages(
        () =>
          new EmbedBuilder().setDescription("Page 4\n" + new Date().toString()) // Dynamic page
      );
    }

    pagination
      .addButton(
        new ButtonBuilder()
          .setLabel("Previous")
          .setCustomId("prev")
          .setStyle(ButtonStyle.Primary),
        "PreviousPage"
      )
      .addButton(
        new ButtonBuilder()
          .setLabel("Next")
          .setCustomId("next")
          .setStyle(ButtonStyle.Primary),
        "NextPage"
      );

    pagination.on("error", console.log);

    await pagination.send({ command: interaction, sendAs: "ReplyMessage" });
  },
};

// TODO:
// - pagination
// - fix search on the website (returns when subtype list contains a value and not values in sent order)
// - mobile view
// - clean up code (create static part of embeds might be a function)
