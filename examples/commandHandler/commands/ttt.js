const { ticTacToe } = require('utilcord');
const { ApplicationCommandOptionType } = require('discord-api-types');
const { Command } = require('utilcord');

module.exports = new Command({
    data: {
        name: 'tictactoe',
        description: 'Tic Tac Toe game!',
        options: [
            {
                name: 'user',
                type: ApplicationCommandOptionType.User,
                description: 'The user to play against.',
                required: true
            }
        ]
    },
    cooldown: 10,
    execute(client, interaction, options) {
        const user1 = interaction.user;
        const user2 = options.get('user').user;

        const emojis = {};
        emojis[user1.id] = '❌';
        emojis[user2.id] = '⭕';

        ticTacToe({ user1, user2, emojis, interaction });
    }
});
