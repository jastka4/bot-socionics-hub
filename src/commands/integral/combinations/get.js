import { SlashCommandSubcommandBuilder } from "discord.js";
import { Pagination } from "pagination.djs"
import "dotenv/config"

import { format, getUniqueSubsets, typeIndicators } from "../../../shared/integral-shared.js";

/**
 * Discord slash command that calculates all proper subsets of Socionics types that combine into the specified target integral type.
 * 
 * The "target" option is a choice option generated from then known set of Socionics types.
 *
 * Command usage example:
 * `/integral combinations get target: LII`
 */
export const command = {
    data: new SlashCommandSubcommandBuilder()
        .setName("get")
        .setDescription("Finds all proper subsets that result in the target integral type.")
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

        await new Pagination(interaction, {
            limit: parseInt(process.env.INTEGRAL_PAGINATION_LIMIT),
            idle: parseInt(process.env.PAGINATION_IDLE)
        })
            .setColor(0xf1c40f)
            .setTitle(`Subsets resulting in ${target}`)
            .setPrevDescription(`Found **${subsets.length}** subset${subsets.length == 1 ? '' : 's'}.\n`)
            .setDescriptions(format(subsets))
            .setEmojis({
                firstEmoji: '⏮',
                prevEmoji: '◀️',
                nextEmoji: '▶️',
                lastEmoji: '⏭'
            })
            .render()
    }
}
