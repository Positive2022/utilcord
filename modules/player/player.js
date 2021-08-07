const voice = require('@discordjs/voice');
const ytdl = require('discord-ytdl-core');
const {createAdapter} = require('@discordjs/voice');

const wait = (ms) => new Promise((resolve, reject) => {setTimeout(resolve, ms);});

function connect(connection){
    return new Promise(async (resolve, reject) => {
        try{
            await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 30000);
            resolve();
        } catch(error) {
            connection.destroy();
            console.log(error);
            reject(error);
        }
    });
}

const events = new Map();
var optionss;

class Player {
      constructor(client) {
        const event = new EventEmitter();
        this.emit = event.emit;
        this.on = event.on;
        this.off = event.off;
        this.once = event.once;
        this.client = client;
        this.queues = new Discord.Collection();
      }

    async play(stream, options = {}){
        return new Promise((resolve, reject) => {

            if(stream === undefined || stream === "") return reject(`Stream is required`);

            this.stream = stream;
            const yturl = ytdl.validateURL(stream) ? true : false;

            if(this.playing === true){
                this.playing = false;
            }
            if(yturl === false){
                this.resource = voice.createAudioResource(this.stream, {
                    inputType: voice.StreamType.Arbitrary,
                    inlineVolume: 10/10
                });
                this.resource.playStream.on('end', () => {
                    if(events.get('stop')) events.get('stop')();
                    this.playing = false;
                    if(optionss['autoleave'] === true) voice.getVoiceConnection(this.channel.guild.id)?.disconnect();
                });
                this.resource.encoder.on('error', error => {
                    reject(error);
                });
                this.player.play(this.resource);
                voice.entersState(this.player, voice.AudioPlayerStatus.Playing, 5e3);
            } else {
                ytdl.getInfo(this.stream).then(info => {
                    const download = ytdl.downloadFromInfo(info, {
                        quality: (options.quality === 'high' ? 'highestaudio' : 'lowestaudio'),
                        filter: 'audioonly',
                        highWaterMark: 64 * 64
                    });
                    download.on('error', error => {
                        this.playing = false;
                        reject(error);
                    });
                    this.resource = voice.createAudioResource(download, {
                        inputType: voice.StreamType.Arbitrary,
                        inlineVolume: 10/10
                    });
                    this.resource.playStream.on('end', () => {
                        if(events.get('stop')) events.get('stop')();
                        this.playing = false;
                        if(optionss['autoleave'] === true) voice.getVoiceConnection(this.channel.guild.id)?.disconnect();
                    });
                    this.player.play(this.resource);
                    voice.entersState(this.player, voice.AudioPlayerStatus.Playing, 5e3);

                }).catch(err => {
                    this.playing = false;
                    reject(err);
                })
            }
            if(this.connection === undefined || this.connected === false){
                const connection = voice.joinVoiceChannel({
                    channelId: this.channel.id,
                    guildId: this.channel.guild.id,
                    adapterCreator: createAdapter(this.channel)
                });
                connect(connection).then(() => {
                    this.subscribtion = connection.subscribe(this.player);
                    this.connection = connection;
                    this.connected = true;
                    this.subscribtion.player.on('subscribe', () => {
                        if(events.get('play')) events.get('play')();
                        this.playing = true;
                    });
                    this.subscribtion.player.on('unsubscribe', () => {
                        if(this.playing === false) return;
                        if(events.get('stop')) events.get('stop')();
                        this.playing = false;
                        this.connected = false;
                    });
                    resolve();
                }).catch(err => {
                    this.playing = false;
                    reject(err);
                });
            } else {
                this.subscribtion = this.connection.subscribe(this.player);
                if(events.get('play')) events.get('play')();
                resolve();
            }
        });
    }
    async destroy(){
        this.connection.destroy();
        this.connected = false;
    }
    async disconnect(){
        this.connection.disconnect();
        this.connected = false;
    }
    async skip(){
        this.subscribtion.player.stop();
    }
    async reconnect(timeout){
        return new Promise(async (resolve, reject) => {
            this.connection.destroy();
            await wait(timeout || 2000);
            const connection = voice.joinVoiceChannel({
                channelId: this.channel.id,
                guildId: this.channel.guild.id,
                adapterCreator: createAdapter(this.channel)
            });
            connect(connection).then(() => {
                this.subscribtion = connection.subscribe(this.player);
                this.connection = connection;
                this.playing = true;
                resolve();
            }).catch(err => {
                reject(err);
                this.playing = false;
            });
        });
    }
    async pause(){
        this.subscribtion.player.pause();
    }
    async resume(){
        this.subscribtion.player.unpause();
    }
    async getStatus(){
        return this.subscribtion.player.checkPlayable();
    }
    async getListeners(){
        return this.channel.members.size;
    }
    async volume(volume){
        if(typeof volume !== "string" && typeof volume !== "number") throw Error(`Invalid type of volume`);
        if(typeof volume === "number"){
            if(volume > 10) throw Error(`Volume can't be higher than 10`);
            this.resource.volume.setVolumeLogarithmic(volume / 10);
        } else {
            let volumestring = volume;
            if(!volumestring.includes("/")) volumestring += "/ 10";
            let vol = volumestring.split("/");
            if(Number(vol[0]) > Number(vol[1])) throw Error(`Invalid type of volume`);
            this.resource.volume.setVolumeLogarithmic(Number(vol[0]) / Number(vol[1]));
        }
    }
    async on(event, callback){
        if(!event || !callback) throw Error(`You need to specify an event and a callback`);
        if(typeof event !== "string") throw Error(`Invalid event`);
        if(typeof callback !== "function") throw Error(`Callback is not a function`);
        events.set(event.toLowerCase(), callback);
    }
}

module.exports = Player;