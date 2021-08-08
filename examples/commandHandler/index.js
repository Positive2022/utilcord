const  token = "get token somehow"
const Discord = require('discord.js')
var intent = new Discord.Intents(Object.values(Discord.Intents.FLAGS))
intent.remove(['GUILD_PRESENCES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING', 'GUILD_MESSAGE_TYPING']) // Your intents.

const { UtilsClient } = require('utilcord');
const client = new UtilsClient({
    intents: intent,
    //Enable cache by commenting them out.
        makeCache: Discord.Options.cacheWithLimits({
        //ApplicationCommandManager: 0,
        //BaseGuildEmojiManager: 0,
        //ChannelManager: 0,
        //GuildBanManager: 0,
        //GuildChannelManager: 0,
        //GuildInviteManager: 0,
        //GuildManager: 0,
        GuildMemberManager: 0,
        //GuildStickerManager: 0,
        //MessageManager: 0,
        //PermissionOverwriteManager: 0,
        PresenceManager: 0,
        //ReactionManager: 0,
        ReactionUserManager: 0,
        //RoleManager: 0,
        //StageInstanceManager: 0,
        //ThreadManager: 0,
        //ThreadMemberManager: 0,
        UserManager: 0,
        //VoiceStateManager: 0
    }),
    allowedMentions: {
        parse: ['roles'],
        repliedUser: true
    }
});

client.on('ready', async () => {
    client.loadCommands(__dirname + '/commands');
    if (!client.application?.owner) await client.application?.fetch();
    client.guilds.cache.forEach(async g => {
        client.deployCommands(token, client.user.id, g.id);
    })
});

client.on('interactionCreate', interaction => {
    client.handleCommand(interaction);
});

client.login(token);
