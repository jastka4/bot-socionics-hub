import { Client, Collection, IntentsBitField } from "discord.js";
import { config } from "dotenv";
import express from "express";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from 'node:url';

import { loadCommands } from './utils/load-commands.js';

config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.commands = new Collection();

const commands = await loadCommands(join(__dirname, "commands"));
commands.forEach((command) => {
  client.commands.set(command.data.name, command);
});

const eventsPath = join(__dirname, "events");
const eventFiles = readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const { event } = await import(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.TOKEN);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
