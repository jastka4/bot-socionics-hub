const { Events } = require("discord.js");
const { deployCommands } = require("../deploy-commands");

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {
    await deployCommands(guild.id);
  },
};
