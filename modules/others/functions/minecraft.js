class Minecraft {

    achievement(options = {}) {
        let emoji = Math.floor((Math.random() * 40) + 1);
        return img = `https://minecraftskinstealer.com/achievement/${emoji}/Achievement%20Unlocked!!/${options.text ? `${options.text}` : `Achievement Unlocked!`}`
    }
}