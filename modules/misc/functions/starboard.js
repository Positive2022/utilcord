const { MessageEmbed } = require('discord.js');
const { EventEmitter } = require('events');

// Requires message intent for verified bots (starting April 2022)
class Starboard extends EventEmitter {
    constructor(
        client,
        { saveStarboard, editStarboard, deleteStarboard, getAllStarboards }
    ) {
        super();

        if (!client?.constructor?.name === 'Client') {
            throw new Error('The client must be provided!');
        } else if (
            typeof saveStarboard !== 'function' ||
            typeof getAllStarboards !== 'function'
        ) {
            throw new Error(
                'The saveStarboard, editStarboard, deleteStarboard, and getAllStarboards functions must be provided!'
            );
        }

        this.client = client;

        this._saveStarboard = saveStarboard;
        this._editStarboard = editStarboard;
        this._deleteStarboard = deleteStarboard;
        this._getAllStarboards = getAllStarboards;

        this.client.on('messageReactionAdd', (reaction, user) =>
            this._reactionAdd(reaction, user)
        );

        this.client.on('messageReactionRemove', (reaction, user) =>
            this._reactionRemove(reaction, user)
        );
    }

    async create({
        channel,
        starCount = 5,
        emoji = '⭐',
        selfStar = true,
        botStar = false
    }) {
        if (!channel) {
            throw new Error('The starboard channel must be provided!');
        }

        this._saveStarboard({ channel, starCount, emoji, selfStar, botStar });
    }

    async edit(id, data) {
        const starboard = (await this._getAllStarboards()).filter(
            s => s.channel.guild.id === id
        );

        if (!starboard) throw new Error('No starboard for that guild.');

        if (!data.channel) data.channel = starboard.channel;
        else if (!data.starCount) data.starCount = starboard.starCount;
        else if (!data.emoji) data.emoji = starboard.emoji;
        else if (!data.selfStar) data.selfStar = starboard.selfStar;
        else if (!data.botStar) data.botStar = starboard.botSar;

        await this._editStarboard(data);
    }

    async delete(id) {
        const starboard = (await this._getAllStarboards()).filter(
            s => s.channel.guild.id === id
        );

        if (!starboard) throw new Error('No starboard for that guild.');

        await this._deleteStarboard(starboard);
    }

    async _reactionAdd(reaction, user) {
        if (!reaction.message?.url) await reaction.message.fetch();

        const starboardObj = (await this._getAllStarboards()).filter(
            s => s.channel.guild.id === reaction.message.guild.id
        );
        if (!starboardObj) return;

        const { channel, starCount, emoji, selfStar, botStar } = starboardObj;

        const em = /\d{10,}/.test(emoji)
            ? this.client.emojis.cache.get(emoji)
            : emoji;

        if (reaction.emoji.name !== (em.name ?? em)) return;
        else if (user.bot && !botStar) return;
        else if (user.id === reaction.message.author.id && !selfStar) return;

        this.emit('starboardReactionAdd', reaction, user, starboardObj);

        if (reaction.count === starCount) {
            const messages = await channel.messages.fetch();
            const message = messages.find(
                m => m.embeds[0].footer.text === reaction.message.id
            );

            if (message) return;

            const embed = new MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
                .setDescription(reaction.message.content)
                .addField('Link:', `[Jump!](${reaction.message.url})`)
                .setFooter(reaction.message.id);

            const messageObj = {
                content: `${
                    em.name
                        ? `<${em.animated ? 'a' : ''}:${em.name}:${em.id}`
                        : em
                } **${reaction.count}** | ${channel}`,
                embeds: [embed]
            };

            if (reaction.message.attachments.size) {
                messageObj.files = reaction.message.attachments.map(a => a);
            }

            channel.send(messageObj);
        } else if (reaction.count > starCount) {
            const messages = await channel.messages.fetch();
            const message = messages.find(
                m => m.embeds[0].footer.text === reaction.message.id
            );

            if (!message) return;

            const embed = message.embeds[0];

            const messageObj = {
                content: `${
                    em.name
                        ? `<${em.animated ? 'a' : ''}:${em.name}:${em.id}`
                        : em
                } **${reaction.count}** | ${channel}`,
                embeds: [embed]
            };

            if (reaction.message.attachments.size) {
                messageObj.files = reaction.message.attachments.map(a => a);
            }

            message.edit(messageObj);
        }
    }

    _reactionRemove(reaction, user) {
        if (!reaction.message?.url) await reaction.message.fetch();

        const starboardObj = (await this._getAllStarboards()).filter(
            s => s.channel.guild.id === reaction.message.guild.id
        );
        if (!starboardObj) return;

        const { channel, emoji, selfStar, botStar } = starboardObj;

        const em = /\d{10,}/.test(emoji)
            ? this.client.emojis.cache.get(emoji)
            : emoji;

        if (reaction.emoji.name !== (em.name ?? em)) return;
        else if (user.bot && !botStar) return;
        else if (user.id === reaction.message.author.id && !selfStar) return;

        this.emit('starboardReactionRemove', reaction, user, starboardObj);

        const messages = await channel.messages.fetch();
        const message = messages.find(
            m => m.embeds[0].footer.text === reaction.message.id
        );

        if (!message) return;

        const embed = message.embeds[0];

        const messageObj = {
            content: `${
                em.name ? `<${em.animated ? 'a' : ''}:${em.name}:${em.id}` : em
            } **${reaction.count}** | ${channel}`,
            embeds: [embed]
        };

        if (reaction.message.attachments.size) {
            messageObj.files = reaction.message.attachments.map(a => a);
        }

        message.edit(messageObj);
    }
}

module.exports = Starboard;
