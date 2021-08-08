const { Command } = require('utilcord');
const { ApplicationCommandOptionType } = require('discord-api-types');
const { MessageAttachment } = require('discord.js');
const { Animals } = require('utilcord');

module.exports = new Command({
    data: {
        name: 'animal',
        description: 'Shows an image of an animal!',
        cooldown: 2,
        options: [
            {
                name: 'animal',
                type: ApplicationCommandOptionType.String,
                description: 'The animal to show.',
                required: true,
                choices: [
                    {
                        name: 'dog',
                        value: 'dog'
                    },
                    {
                        name: 'cat',
                        value: 'cat'
                    }
                ]
            }
        ]
    },
    cooldown: 5,
    execute(client, interaction, options) {
        const animal = options.get('animal');
        
        const link = await Animals.image(({ Animals: animal }))
        const image = new MessageAttachment(link, `${animal || 'animal'}.jpg`);
        interaction.reply({ files: [image] });
    }
});
