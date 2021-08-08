const { Client, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const ms = require('parse-ms');

class UtilsClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.cooldowns = new Collection();
    }

    loadCommands(commandsDir) {
        const commands = require('require-all')(commandsDir);

        for (const [, command] of commands) {
            this.commands.set(command);
        }
    }

    async deployCommands(token, thisId, guildId) {
        const rest = new REST({ version: '9' }).setToken(token);

        try {
            if (guildId) {
                await rest.put(
                    Routes.applicationGuildCommands(thisId, guildId),
                    { body: this.commands.map(command => command.data) }
                );

                const guild = await this.guilds.fetch(guildId);
                const permissionCommands = this.commands.filter(
                    command => command.permissions
                );

                if (permissionCommands.size) {
                    const fullPermissions = permissionCommands.map(command => {
                        const { id } = guild?.commands.cache.find(
                            c => c.name === command.data.name
                        );

                        const { permissions } = command;
                        return { id, permissions };
                    });

                    guild?.commands.permissions.set({
                        fullPermissions
                    });
                }
            } else {
                await rest.put(Routes.applicationCommands(thisId), {
                    body: this.commands.map(command => command.data)
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    handleCommand(interaction) {
        const { options, commandName } = interaction;

        const command = this.commands.get(commandName);
        if (!command) return;

        const { cooldowns } = this;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();

        const timestamps = cooldowns.get(command.data.name);
        const cooldownAmount = command.cooldown * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                    if (options.CooldownMsg && options.CooldownMsg == true) {
                    const timeLeft = ms(expirationTime - now);
                    return interaction.reply({
                        content: `Please wait ${timeLeft.minutes}m ${timeLeft.seconds}s before reusing the \`${command.data.name}\` command.`,
                        ephemeral: true
                    });
                }
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(
            () => timestamps.delete(interaction.user.id),
            cooldownAmount
        );

        command.execute(this, interaction, options);
    }
}

module.exports = UtilsClient;
