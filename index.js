'use strict';

// Require dotenv for environment variables
require('dotenv').config();

const fs = require('node:fs');

// Require the necessary discord.js classes
const {Client, Events, GatewayIntentBits, Partials, Collection} = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
    ],

    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ],

    allowedMentions: {parse: ['users', 'roles'], repliedUser: true},
});

client.commands = new Collection();

// Slash command handler
const commandFolders = ['Public'];

try {
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./Commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }
} catch (e) {
    console.error('Could not load Slash Commands', e);
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Emitted when an interaction is created
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Debug events and log them to the console
if (process.env.APP_ENV === 'TRUE') {
    client.on(Events.Debug, console.log)
        .on(Events.Error, console.log);
}

// Log in to Discord with your client's token
switch (process.env.APP_ENV) {
    case 'development':
        client.login(process.env.APP_TOKEN).then(() => {
            console.log('\x1b[33mBot is trying to sign in as DEVELOPER\x1b[0m');
        })
        break
    case 'production':
        client.login(process.env.APP_TOKEN).then(() => {
            console.log('\x1b[36mBot is trying to sign in as PRODUCTION\x1b[0m');
        })
        break
    default:
        console.error('Environment has not been set up correctly');
}