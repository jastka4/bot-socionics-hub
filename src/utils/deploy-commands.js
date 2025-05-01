const dotenv = require("dotenv");
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const { loadCommands } = require('./load-commands');

dotenv.config();

const commands = loadCommands(path.join(__dirname, "../commands")).map(cmd => cmd.data.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
