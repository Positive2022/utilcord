const {
    Command
} = require('utilcord');

module.exports = new Command({
    data: {
        name: 'ping',
        cooldown: 10,
        description: 'Replies with pong!'
    },
    execute(client, interaction, options) {
        interaction.reply('Pong!');
    }
});