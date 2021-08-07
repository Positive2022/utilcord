const fetch = require('node-fetch')
let Animes = ["neko", "nekogif", "holo", "cuddle", "foxgirl", "waifu", "smug", "baka", "slap", "poke", "feed", "pat", "hug", "kemonomimi", "kiss", "tickle"]

class Anime {
    async anime(options = {}) {
        let res, json
        if (!options || !options.Anime) {
            Anime = Animes[Math.floor(Math.random() * Animes.length)];
            try {
                res = await fetch(Anime == "foxgirl" ? "https://nekos.life/api/v2/img/fox_girl" : Anime == "nekogif" ? "https://nekos.life/api/v2/img/ngif" : `https://nekos.life/api/v2/img/${Anime}`),
                    json = await res.json();
            } catch (err) {
                throw new Error(err)
            }
            if (!json || !json.url) throw new Error(`No Image.`)
            return json.url
        } else {

            if (!Animes.includes(options.Anime.toLowerCase())) {
                throw new Error(`__Invalid Anime Provided__`, `**Choose from the following:** ${Animes.map(Ani => Ani.charAt(0).toUpperCase() + Ani.slice(1)).join(", ")}`)
            }
            Anime = options.Anime.toLowerCase();
            try {
                res = await fetch(Anime == "foxgirl" ? "https://nekos.life/api/v2/img/fox_girl" : Anime == "nekogif" ? "https://nekos.life/api/v2/img/ngif" : `https://nekos.life/api/v2/img/${Anime}`),
                    json = await res.json();

            } catch (err) {
                throw new Error(err)
            }

            if (!json || !json.url) throw new Error(`No Image`)
            return json.url
        }
    }
}

module.exports = Anime;