const {
    Command
} = require('utilcord');

module.exports = new Command({
    cooldown: 10,
    data: {
        name: 'ping',
        description: 'Replies with pong!'
    },
    execute(client, interaction, options) {
        interaction.reply('Pong!');
    }
});