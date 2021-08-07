const Discord = require("discord.js");
const {
    EventEmitter
} = require("events");
class Tickets {
    /**
     * create Ticket channel
     * @param {Discord.Interaction} i
     * @param {Discord.Message} msg
     * @param {string} mod 
     */
    async createTicket(i, msg, mod) {
        const guild = i.guild
        if (!i.guild.me.permissions.has([Discord.Permissions.FLAGS.MANAGE_CHANNELS, Discord.Permissions.FLAGS.MANAGE_ROLES])) return;
        try {
            var ticket = await guild.channels.create(`${i.member.user.username}-ticket`, {
                type: "text",
                permissionOverwrites: [{
                        id: guild.roles.everyone.id,
                        deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: ns.member.user,
                        allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY, Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.ATTACH_FILES, Discord.Permissions.FLAGS.EMBED_LINKS],
                    }
                ],
            });
        } catch (err) {
            throw new Error(err)
        }
        if (mod) {
            var role = guild.roles.cache.get(`${mod}`)
            if (!role) throw new Error(`${mod} is not a valid roleID or is not cached.`)
            if (!guild.me.permissions.has([Discord.Permissions.FLAGS.MANAGE_CHANNELS, Discord.Permissions.FLAGS.MANAGE_ROLES])) return
            await ticket.overwritePermissions([{
                id: role.id,
                allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY, Discord.Permissions.FLAGS.ATTACH_FILES, Discord.Permissions.FLAGS.EMBED_LINKS],
            }]);
            ticket.send(msg); // the embed or whatever user wants to send when ticket is made
        }
    }

    async closeTicket(message, member) {
        if (!message.guild.me.permissionsIn(message.channel).has([Discord.Permissions.FLAGS.MANAGE_CHANNELS, Discord.Permissions.FLAGS.MANAGE_ROLES])) return false;

        try {
            await message.channel.updateOverwrite(message.guild.roles.everyone.id, {
                VIEW_CHANNEL: false
            })
            await message.channel.updateOverwrite(member.user, {
                VIEW_CHANNEL: false
            })
        } catch (err) {
            throw new Error(err)
        }
    }

    async openTicket(message, member) {
        if (!message.guild.me.permissionsIn(message.channel).has([Discord.Permissions.FLAGS.MANAGE_CHANNELS, Discord.Permissions.FLAGS.MANAGE_ROLES])) return false;
        try {
            await message.channel.updateOverwrite(member.user, {
                VIEW_CHANNEL: true
            })

        } catch (err) {
           throw new Error(err)
        }
    }
    async delTicket(message) {
        try {
        message.channel.delete()
        } catch (err) {
            throw new Error(err)
        }
    }
}
module.exports = Tickets;