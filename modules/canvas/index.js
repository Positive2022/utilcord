class Canvas {

    async avatar(interaction, userID, options = {}) {
        if (!userID || typeof userID !== 'string') userID = interaction.user.id
            let user = await message.client.users.fetch(userID);
        if (!user) user = interaction.user
        return user.displayAvatarURL(options)
    }
}

module.exports = Canvas;