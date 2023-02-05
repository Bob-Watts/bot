'use strict';

require('dotenv').config()

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;
const rest = new REST({ version: '10' }).setToken(process.env.APP_TOKEN);

const registerSlashCommandFolders = [
    ['Fun'],
    // ['Information'],
    // ['Moderation'],
    // ['Public'],
    // ['Settings'],
];

const loadCommands = async () => {
    const commands = [];
    for (const [folder] of registerSlashCommandFolders) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`)
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./Commands/${folder}/${file}`);
            commands.push(command.data);
        }
    }
    return commands;
};

(async () => {
    try {
        const commands = await loadCommands();
        console.log('Started refreshing application (/) commands.');

        switch (process.env.APP_ENV) {
            case 'production':
                await rest.put(Routes.applicationCommands(clientID), { body: commands });
                break;
            case 'development':
                await rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands });
                break;
            default:
                console.error('No environment specified.');
        }

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();