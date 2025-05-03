const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');

/**
 * Loads all Discord slash commands from a given directory.
 * Supports nested commands with subcommands and subcommand groups.
 *
 * @param {string} commandsPath - Path to the root commands directory.
 * @returns {Array<Object>} Array of command objects ready to register with Discord.
 */
function loadCommands(commandsPath) {
  const commands = [];

  for (const entry of readDirectory(commandsPath)) {
    const fullPath = path.join(commandsPath, entry.name);

    if (isJavaScriptFile(entry)) {
      const command = loadCommand(fullPath);
      if (command) {
        commands.push(command);
      }
    }

    if (entry.isDirectory()) {
      const builder = new SlashCommandBuilder()
        .setName(entry.name)
        .setDescription(`Commands for ${entry.name}`);
      const dispatcher = {};

      for (const subEntry of readDirectory(fullPath)) {
        const subPath = path.join(fullPath, subEntry.name);

        if (isJavaScriptFile(subEntry)) {
          const command = loadCommand(subPath);
          if (command) {
            builder.addSubcommand(command.data);
            dispatcher[command.data.name] = command.execute;
          }
        }

        if (subEntry.isDirectory()) {
          builder.addSubcommandGroup(group =>
            group.setName(subEntry.name)
              .setDescription(`${subEntry.name} group`)
              .addSubcommands(subBuilder => {
                for (const file of readDirectory(subPath).filter(file => isJavaScriptFile(file))) {
                  const command = loadCommand(path.join(subPath, file));
                  if (command) {
                    subBuilder.addSubcommand(command.data);
                    dispatcher[`${subEntry.name}/${command.data.name}`] = command.execute;
                  }
                }
                return subBuilder;
              })
          );
        }
      }

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
 * Loads a Discord slash command from the given path.
 * 
 * @param {string} filePath - The path to load the command from.
 * @returns {Object|undefined} The command object with `data` and `execute`, or undefined if couldn't be loaded.
 */
function loadCommand(filePath) {
  try {
    const command = require(filePath);

    if (!command.data || !command.execute) {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
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
 * @returns {fs.Dirent[]} List of directory entries.
 */
function readDirectory(dirPath) {
  return fs.readdirSync(dirPath, { withFileTypes: true });
}

/**
 * Checks if the entry is a JavaScript file.
 *
 * @param {fs.Dirent} entry - Name of the file.
 * @returns {boolean} True if it ends with `.js`.
 */
function isJavaScriptFile(entry) {
  return entry.isFile() && entry.name.endsWith('.js');
}

module.exports = { loadCommands };
