var Animals = ["dog", "cat", "duck", "bird", "panda", "wolf", "fox", "seal", "llama", "alpaca", "camel", "lizard", 'whale', 'koala', 'raccoon', 'kangaroo', 'red_panda']
const fetch = require('node-fetch')
class Animals {
    async image(options = {}) {
        if (!options.Animals) {
            console.warn(`**You should choose animal from the following:** ${Animals.map(Ani => Ani.charAt(0).toUpperCase() + Ani.slice(1)).join(", ")}`)
            Animal = Animals[Math.floor(Math.random() * Animals.length)];

            if (['whale', 'koala', 'raccoon', 'kangaroo', 'red_panda'].includes(Animal.toLowerCase())) {
                const data = await fetch(`https://some-random-api.ml/img/${args[0].toLowerCase()}`).then((res) => res.json());
                return data.link
            } else {
                try {
                    res = await fetch(`https://apis.duncte123.me/animal/${Animal.toLowerCase()}`, {
                        headers: {
                            "user-agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; PalmSource/hspr-H102; Blazer/4.0) 16;320x320"
                        }
                    }), json = await res.json();
                } catch (err) {
                    throw new Error(err)
                }
                if (!json.data || !json.data.file) throw new Error(`No Image found.`)
                return json.data.file
            }
        } else if (!Animals.includes(options.Animals.toLowerCase())) throw new Error(`**Choose animal from the following:** ${Animals.map(Ani => Ani.charAt(0).toUpperCase() + Ani.slice(1)).join(", ")}`)

        try {
            if (['whale', 'koala', 'raccoon', 'kangaroo', 'red_panda'].includes(options.Animals.toLowerCase())) {
                const data = await fetch(`https://some-random-api.ml/img/${options.Animals.toLowerCase()}`).then((res) => res.json());
                return data.link
            } else {
                res = await fetch(`https://apis.duncte123.me/animal/${args[0].toLowerCase()}`, {
                    headers: {
                        "user-agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; PalmSource/hspr-H102; Blazer/4.0) 16;320x320"
                    }
                }), json = await res.json();
            }
        } catch (err) {
            throw new Error(err)
        }

        if (!json.data.file) throw new Error(`No image.`)

        return json.data.file
    }

    async fact(options = {}) {
        if (!options.Animals) {
            console.warn(`**You should choose animal from the following:** ${Animals.map(Ani => Ani.charAt(0).toUpperCase() + Ani.slice(1)).join(", ")}`)
            try {
                var res = await fetch("https://nekos.life/api/v2/fact")
                var json = await res.json();
            } catch (err) {
                throw new Error(err)
            }
            if (!json.fact) throw new Error(`No Fact.`)
            return json.fact;

        } else {
            if (!Animals.includes(options.Animals.toLowerCase())) throw new Error(`**You should choose animal from the following:** ${Animals.map(Ani => Ani.charAt(0).toUpperCase() + Ani.slice(1)).join(", ")}`)

            try {
                res = await fetch(`https://some-random-api.ml/facts/${options.Animals.toLowerCase()}`), json = await res.json();

            } catch (err) {
                throw new Error(err)
            }

            if (!json.fact) throw new Error(`No Fact.`)
            return json.fact
        }
    }
}

module.exports = Animals;