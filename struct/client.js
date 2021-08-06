const { Client, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

class UtilsClient extends Client {
    constructor(options) {
        super(options);

        this.commands = new Collection();
    }

    loadCommands(commandsDir) {
        const commands = require('require-all')(commandsDir);

        for (const [, command] of commands) {
            client.commands.set(command);
        }
    }

    async deployCommands(token, clientId, guildId) {
        const rest = new REST({ version: '9' }).setToken(token);

        try {
            if (guildId) {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: client.commands.map(command => command.data) }
                );
            } else {
                await rest.put(Routes.applicationCommands(clientId), {
                    body: client.commands.map(command => command.data)
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = UtilsClient;
