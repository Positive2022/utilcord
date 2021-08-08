const  token = "get token"
const { Intents } = require('discord.js');
const Discord = require('discord.js')
var intent = new Intents(Object.values(Intents.FLAGS))
intent.remove(['GUILD_PRESENCES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING', 'GUILD_MESSAGE_TYPING'])

const { UtilsClient } = require('utilcord');
const client = new UtilsClient({
    intents: intent,
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
    },
    messageCacheMaxSize: 1,
    messageCacheLifetime: 1000,
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
