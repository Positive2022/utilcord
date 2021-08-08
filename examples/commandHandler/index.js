const { token } = require("./config.json");
const { Intents } = require('discord.js');

const { UtilsClient } = require('utilcord');
const client = new UtilsClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', async () => {
    client.loadCommands(__dirname + '/commands');
    if (!client.application?.owner) await client.application?.fetch();
    client.guilds.cache.forEach(async g => {
        client.deployCommands(token, client.user.id, g.id);
    })
});

client.on('interactionCreate', interaction => {
    client.handleCommand(interaction);
});

client.login(token);
