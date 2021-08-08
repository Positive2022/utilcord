class Canvas {

    async avatar(interaction, userID, options = {}) {
        if (!userID || typeof userID !== 'string') userID = interaction.user.id
        let user = await message.client.users.fetch(userID);
        if (!user) user = interaction.user
        return user.displayAvatarURL(options)
    }

    async awooify(interaction, userID, options = {}) {
        const av = this.avatar(interaction, userID, options = {
            format: "png",
            dynamic: false
        })
        try {
            var res = await fetch(`https://nekobot.xyz/api/imagegen?type=awooify&url=${encodeURIComponent(av)}`);
            var json = await res.json();
            if (!json.message) throw new Error(`Not Found.`);
        } catch (err) {
           throw new Error(err)
        }
        return json.message
    }
}

module.exports = Canvas;