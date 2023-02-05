'use strict';

// Require dotenv for environment variables
require('dotenv').config();

const giphy = require('giphy-api')(process.env.GIPHY_KEY);

const {SlashCommandBuilder} = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('gif')
    .setDescription('Returns a random GIF based on a keyword or phrase')
    .addStringOption(option =>
        option.setName('keyword')
            .setDescription('Please provide a keyword for the gif you want to search.')
            .setRequired(true));

module.exports = {
    data: data,
    name: 'gif',
    description: 'Returns a random GIF based on a keyword or phrase',
    execute: async (interaction) => {
        const keyword = interaction.options.getString('keyword');

        await giphy.random({tag: keyword}).then(function (response) {
            const gifUrl = response.data.embed_url;

            interaction.reply({content: gifUrl || `No results found for **${keyword}**`});
        });
    }
};