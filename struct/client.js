const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const ms = require('parse-ms');

class UtilsClient extends Discord.Client {
    constructor(options) {
        super(options);
        this.slashcommands = new Discord.Collection();
        this.cooldowns = new Discord.Collection();
    }

    loadCommands(commandsDir) {
        const commands = require('require-all')(commandsDir);

        for (const [, command] of Object.entries(commands)) {
            this.slashcommands.set(command);
        }
    }

    async deployCommands(token, thisId, guildId) {
        const rest = new REST({ version: '9' }).setToken(token);

        try {
            if (guildId) {
                await rest.put(
                    Routes.applicationGuildCommands(thisId, guildId),
                    { body: this.slashcommands.map(command => command.data) }
                );

                const guild = await this.guilds.fetch(guildId);
                const permissionCommands = this.slashcommands.filter(
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
                    body: this.slashcommands.map(command => command.data)
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async handleCommand(interaction, options = {}) {
        if (!interaction.isCommand()) return;

        const command = this.slashcommands.get(interaction.commandName);
        if (!command) return;

        if (command.cooldown && typeof parseInt(command.cooldown) !== "number") throw new Error(`Cooldown should be a number.`)

        if (!this.cooldowns.has(command.data.name)) {
            this.cooldowns.set(command.data.name, new Discord.Collection());
        }

        const now = Date.now();

        const timestamps = this.cooldowns.get(command.data.name);
        const cooldownAmount = command.cooldown * 1000;
// Allows to run two bots at single server without problem with cooldown.
        if (timestamps.has(`${interaction.user.id}_${interaction.client.user.id}`)) { 
            const expirationTime = timestamps.get(`${interaction.user.id}_${interaction.client.user.id}`) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = ms(expirationTime - now);
                return interaction.reply({
                    content: `Please wait ${timeLeft.minutes == 0 ? `${timeLeft.seconds}s` : `${timeLeft.minutes}m ${timeLeft.seconds}s`} before reusing the \`${command.data.name}\` command.`,
                    ephemeral: true
                });
            }
        }

        timestamps.set(`${interaction.user.id}_${interaction.client.user.id}`, now);
        setTimeout(
            () => timestamps.delete(`${interaction.user.id}_${interaction.client.user.id}`),
            cooldownAmount
        );

        await command.execute(this, interaction, options);
    }
}

module.exports = UtilsClient;
