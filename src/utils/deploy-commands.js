import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from 'node:url';

import { loadCommands } from './load-commands.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const commands = (await loadCommands(join(__dirname, "../commands"))).map(cmd => cmd.data.toJSON());

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
