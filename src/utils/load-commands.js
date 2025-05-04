import { SlashCommandBuilder } from 'discord.js';
import { Dirent, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Loads all Discord slash commands from a given directory.
 * Supports nested commands with subcommands and subcommand groups.
 *
 * @param {string} commandsPath - Path to the root commands directory.
 * @returns {Array<Object>} Array of command objects ready to register with Discord.
 */
export async function loadCommands(commandsPath) {
  const commands = [];

  for (const entry of readDirectory(commandsPath)) {
    const fullPath = join(commandsPath, entry.name);

    if (isJavaScriptFile(entry)) {
      const command = await loadCommand(fullPath);
      if (command) {
        commands.push(command);
      }
    }

    if (entry.isDirectory()) {
      const { builder, dispatcher } = await loadBranchedCommand(fullPath, entry.name);

      commands.push({
        data: builder,
        async execute(interaction) {
          const group = interaction.options.getSubcommandGroup(false);
          const sub = interaction.options.getSubcommand();
          const key = group ? `${group}/${sub}` : sub;

          const handler = dispatcher[key];
          if (!handler) {
            await interaction.reply({ content: 'Command not found.', ephemeral: true });
            return;
          }

          try {
            await handler(interaction);
          } catch (err) {
            console.error(`[ERROR] Execution error for ${key}:`, err);
            await interaction.reply({ content: 'Execution failed.', ephemeral: true });
          }
        }
      });
    }
  }

  return commands;
}

/**
 * Builds a command with subcommands and optional subcommand groups.
 *
 * @param {string} groupPath - The path to load the command group from.
 * @param {string} groupName - Name of the command group.
 * @returns {{ builder: SlashCommandBuilder, dispatcher: Object }} Map of command "data" and "execute" properties.
 */
async function loadBranchedCommand(groupPath, groupName) {
  const builder = new SlashCommandBuilder()
    .setName(groupName)
    .setDescription(`Commands for ${groupName}`);

  const dispatcher = {};

  for (const subEntry of readDirectory(groupPath)) {
    const subPath = join(groupPath, subEntry.name);

    if (isJavaScriptFile(subEntry)) {
      const command = await loadCommand(subPath);

      if (command) {
        builder.addSubcommand(command.data);
        dispatcher[command.data.name] = command.execute;
      }
    }

    if (subEntry.isDirectory()) {
      const subGroupName = subEntry.name;
      const groupBuilder = builder.addSubcommandGroup(subGroup =>
        subGroup
          .setName(subGroupName)
          .setDescription(`${subGroupName} group`)
      );

      await Promise.all(readDirectory(join(groupPath, subGroupName))
        .filter(isJavaScriptFile)
        .map(async (file) => {
          const filePath = join(groupPath, subGroupName, file.name);
          const command = await loadCommand(filePath);

          if (command) {
            groupBuilder.options.at(-1).addSubcommand(command.data);
            dispatcher[`${subGroupName}/${command.data.name}`] = command.execute;
          }
        }));
    }
  }

  return { builder, dispatcher };
}

/**
 * Loads a Discord slash command from the given path.
 * 
 * @param {string} filePath - The path to load the command from.
 * @returns {Object|undefined} The command object with `data` and `execute`, or undefined if couldn't be loaded.
 */
async function loadCommand(filePath) {
  try {
    const { command } = await import(filePath)
    if (!command.data) {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" property.`
      );
    }
    if (!command.execute) {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "execute" property.`
      );
    }

    console.info(`[INFO] Loaded: ${filePath}`);
    return command;
  } catch (err) {
    console.error(`[ERROR] Failed to load ${filePath}: ${err.message}`);
  }
}

/**
 * Reads directory entries with file types metadata.
 *
 * @param {string} dirPath - Path to the directory.
 * @returns {Dirent[]} List of directory entries.
 */
function readDirectory(dirPath) {
  return readdirSync(dirPath, { withFileTypes: true });
}

/**
 * Checks if the entry is a JavaScript file.
 *
 * @param {Dirent} entry - Name of the file.
 * @returns {boolean} True if it ends with `.js`.
 */
function isJavaScriptFile(entry) {
  return entry.isFile() && entry.name.endsWith('.js');
}
