import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { format, getUniqueSubsets, typeIndicators } from "../../../shared/integral-shared.js";

/**
 * Discord slash command that calculates all unique subsets of Socionics types that combine into the specified target integral type.
 * 
 * The "target" option is a choice option generated from then known set of Socionics types.
 *
 * Command usage example:
 * `/integral combinations get target: LII`
 */
export const command = {
    data: new SlashCommandSubcommandBuilder()
        .setName("get")
        .setDescription("Finds all unique subsets that result in the target integral type.")
        .addStringOption(option => option
            .setName("target")
            .setDescription("Target integral type.")
            .addChoices(
                ...[...typeIndicators.keys()].map((type) => ({
                    name: type,
                    value: type,
                })))
            .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.get("target").value.toUpperCase();
        const subsets = getUniqueSubsets([...typeIndicators.keys()], target);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xf1c40f)
                    .setTitle(`Found ${subsets.length} subsets that result in **${target}**`)
                    .setDescription(format(subsets)),
            ],
        });
    }
}
