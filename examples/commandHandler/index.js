const { token } = require("./config.json");
const { Intents } = require('discord.js');

const { UtilsClient } = require('utilcord');
const client = new UtilsClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {
    client.loadCommands(__dirname + '/commands');
});

client.on('messageCreate', async message => {
    if (!client.application?.owner) await client.application?.fetch();

    if (
        message.author.id === client.application?.owner.id &&
        message.content.startsWith('!deploy')
    ) {
        client.deployCommands(token, client.user.id, message.guild.id);
        message.reply('Successfully deployed application (/) commands.');
    }
});

client.on('interactionCreate', interaction => {
    client.handleCommand(interaction);
});

client.login(token);
