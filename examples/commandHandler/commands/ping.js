const { Command } = require('utilcord');

module.exports = new Command({
    data: {
        name: 'ping',
        description: 'Replies with pong!'
    },
    cooldown: 10,
    execute(client, interaction, options) {
        interaction.reply('Pong!');
    }
});
