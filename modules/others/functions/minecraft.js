class Minecraft {

    achievement(options = {}) {
        let emoji = Math.floor((Math.random() * 40) + 1);
        return img = `https://minecraftskinstealer.com/achievement/${emoji}/Achievement%20Unlocked!!/${options.text ? `${options.text}` : `Achievement Unlocked!`}`
    }

    UserID() {
        try {
            var res = await fetch(`https://mc-heads.net/minecraft/profile/${encodeURIComponent(args.join(' ').slice(0, 16) || 'Dream')}`);
            var json = await res.json();
            if (!json.id || !json.name) throw new Error('No ID or Name')
        } catch (err) {
            throw new Error(err)
        }
        return json = {
            id: json.id,
            name: json.name
        }
    }
}