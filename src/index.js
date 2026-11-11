import { Client, Collection, Events, IntentsBitField } from "discord.js";
import { config } from "dotenv";
import express from "express";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadCommands } from "./utils/load-commands.js";

config();

if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN is required");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = Number(process.env.PORT || 3000);

function failStartup(error) {
  console.error("[ERROR] Startup failed:", error);
  process.exit(1);
}

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.commands = new Collection();

client.on(Events.Error, (error) => {
  console.error("[ERROR] Discord client error:", error);
});

client.on(Events.ShardError, (error) => {
  console.error("[ERROR] Discord connection error:", error);
});

try {
  const commands = await loadCommands(join(__dirname, "commands"));
  commands.forEach((command) => {
    client.commands.set(command.data.name, command);
  });

  const eventsPath = join(__dirname, "events");
  const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith(".js"),
  );

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const { event } = await import(filePath);
    const handler = async (...args) => event.execute(...args);

    if (event.once) {
      client.once(event.name, handler);
    } else {
      client.on(event.name, handler);
    }
  }

  await client.login(process.env.DISCORD_TOKEN);
} catch (error) {
  failStartup(error);
}

const app = express();

app.get("/health", (req, res) => {
  if (!client.isReady()) {
    return res.status(503).send("Discord client is not ready");
  }

  res.status(200).send("OK");
});

app
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
  .on("error", failStartup);
