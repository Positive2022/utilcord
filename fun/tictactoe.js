const { MessageActionRow, MessageButton } = require('discord.js');

async function ticTacToe({ user1, user2, emojis, interaction }) {
    const gameArray = ['', '', '', '', '', '', '', '', ''];

    let score = {};
    score[user1.id] = '';
    score[user2.id] = '';

    async function playerTurn(user, message) {
        if (!message) {
            const buttons = [];
            for (let i = 0; i < gameArray.length; i++) {
                buttons.push(
                    new MessageButton()
                        .setCustomId(`ttt-${i}`)
                        .setEmoji('❔')
                        .setStyle('SECONDARY')
                );
            }

            const tttRow = new MessageActionRow().addComponents(...buttons);
            await interaction.reply({
                content: `Tic Tac Toe! ${user}, it's your turn!`,
                components: [tttRow]
            });

            message = await interaction.fetchReply();
        }

        const filter = i => i.author.id === user.id;
        const collector = message.createMessageComponentCollector({
            filter,
            max: 100,
            time: 20000
        });

        collector.on('collect', button => {
            const index = parseInt(button.customId.split('-')[1]);
            if (gameArray[index] !== '') {
                return button.reply({
                    content: 'That spot is taken! Pick again.',
                    ephemeral: true
                });
            }

            gameArray[index] = emojis[user.id];
            score[user.id] += `${index}`;

            button.setEmoji(emojis[user.id]);
            button.setStyle('SUCCESS');
            button.setDisabled(true);

            const res = checkWin(gameArray, score[user.id]);
            if (res.win) {
                message.components[0].components.forEach(c =>
                    c.setDisabled(true)
                );
                message.edit(`${user}, you're the winner!`);
            } else if (res.tie) {
                message.components[0].components.forEach(c =>
                    c.setDisabled(true)
                );
                message.edit(`It was a tie!`);
            } else playerTurn(user.id === user1.id ? user2 : user1, message);
        });
    }

    playerTurn(user1);
}

async function checkWin(gameArray, scoreString) {
    const userScore = scoreString.split('').sort().join(' ');
    if (
        /0.+1.+2/.test(userScore) ||
        /3.+4.+5/.test(userScore) ||
        /6.+7.+8/.test(userScore) ||
        /0.+3.+6/.test(userScore) ||
        /1.+4.+7/.test(userScore) ||
        /2.+5.+8/.test(userScore) ||
        /0.+4.+8/.test(userScore) ||
        /3.+4.+6/.test(userScore)
    ) {
        return { win: true };
    } else if (!gameArray.some(elem => elem === '')) return { tie: true };
    else return false;
}

module.exports = ticTacToe;
