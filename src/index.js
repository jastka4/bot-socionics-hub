require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Ready and logged on as ${client.user.tag}`);
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("messageCreate", (msg) => {
  console.log(msg);
  if (msg.content === "hey") {
    msg.reply("hi there");
  }
});

client.login(process.env.BOT_TOKEN);
