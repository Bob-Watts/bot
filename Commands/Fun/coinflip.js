'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Simulate a coin flip and returns either heads or tails.')

module.exports = {
    data: data,
    name: 'coinflip',
    description: 'Simulate a coin flip and returns either heads or tails.',
    execute: async (interaction) => {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const embed = {
            color: parseInt('17a2b8', 16),
            description: `:coin: I flipped a coin and it landed on **${result}**`,
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username,
                icon_url: '',
            },
        };

        await interaction.reply({embeds: [embed]});
    },
};