import { EmbedBuilder, MessageFlags, SlashCommandSubcommandBuilder } from "discord.js";
import { Pagination } from "pagination.djs";
import "dotenv/config"

import { format, getUniqueSubsets, isValid, typeIndicators } from "../../../shared/integral-shared.js";

/**
 * Discord slash command command calculates all proper subsets of provided Socionics types that combine into the specified target integral type.
 * 
 * The "types" option accepts a space-separated list of three-letter types.
 * The "target" option is a choice option generated from then known set of Socionics types.
 * 
 * Command usage example:
 * `/integral combinations subset types: LIE LSI EII SLE ILI SLE target: LII`
 */
export const command = {
    data: new SlashCommandSubcommandBuilder()
        .setName("subset")
        .setDescription("Finds all proper subsets of provided types that result in the target integral type.")
        .addStringOption(option => option
            .setName("types")
            .setDescription(
                "List of types in the three-letter notation (separated by space)."
            )
            .setRequired(true))
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
        const stringOfTypes = interaction.options.get("types").value.toUpperCase();

        if (isValid(stringOfTypes)) {
            const listOfTypes = stringOfTypes.split(" ");
            const subsets = getUniqueSubsets(listOfTypes, target);

            let result = subsets.length
                ? format(subsets)
                : `No subsets of ${listOfTypes.join(", ")} result in **${target}**.`;

            await new Pagination(interaction, {
                limit: parseInt(process.env.INTEGRAL_PAGINATION_LIMIT),
                idle: parseInt(process.env.PAGINATION_IDLE)
            })
                .setColor(0xf1c40f)
                .setTitle(`Subsets resulting in ${target}`)
                .setPrevDescription(`Found **${subsets.length}** subset${subsets.length == 1 ? '' : 's'}.\n`)
                .setDescriptions(result)
                .setEmojis({
                    firstEmoji: '⏮',
                    prevEmoji: '◀️',
                    nextEmoji: '▶️',
                    lastEmoji: '⏭'
                })
                .render();
        } else {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xf1c40f)
                        .setTitle("❗️ Wrong format ❗️")
                        .setDescription(interaction.options.get("types").value)
                        .addFields(
                            {
                                name: "Usage example",
                                value: "`/integral combinations subset 'types: LII LII IEI SLE LIE ILE' 'target: ILE'`",
                            },
                            {
                                name: "Limit",
                                value: `The number of types to process is limited to ${parseInt(process.env.INTEGRAL_MAX_SUBSETS)}.`,
                            }
                        ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
