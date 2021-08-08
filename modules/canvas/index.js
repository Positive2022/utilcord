class Canvas {

    async avatar(interaction, userID, options = {}) {
        if (!userID || typeof userID !== 'string') userID = interaction.user.id
        let user = await message.client.users.fetch(userID);
        if (!user) user = interaction.user
        return user.displayAvatarURL(options)
    }

    async awooify(interaction, userID) {
        const av = await this.avatar(interaction, userID, options = {
            format: "png",
            dynamic: false
        })
        try {
            var res = await fetch(`https://nekobot.xyz/api/imagegen?type=awooify&url=${encodeURIComponent(av.replace('.webp', ''))}`);
            var json = await res.json();
            if (!json.message) throw new Error(`Not Found.`);
        } catch (err) {
            throw new Error(err)
        }
        return json.message
    }

    async baguette(interaction, userID) {
        const av = await this.avatar(interaction, userID, options = {
            format: "png",
            dynamic: false
        })
        try {
            var res = await fetch(`https://nekobot.xyz/api/imagegen?type=baguette&url=${encodeURIComponent(av).replace('.webp', '')}`);
            var json = await res.json();
            if (!json.message) throw new Error(`Not Found.`)
        } catch (err) {
            throw new Error(err)
        }
        return json.message;
    }
}

module.exports = Canvas;