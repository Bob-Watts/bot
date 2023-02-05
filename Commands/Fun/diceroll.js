'use strict';

const {SlashCommandBuilder} = require("discord.js");
const data = new SlashCommandBuilder()
    .setName('diceroll')
    .setDescription('Simulate a coin flip and returns either "heads" or "tails".')

module.exports = {
    data: data,
    name: 'diceroll',
    description: 'Simulate a coin flip and returns either "heads" or "tails".',
    execute: async (interaction) => {
        const result = Math.floor(Math.random() * 6) + 1;

        const embed = {
            color: parseInt('17a2b8', 16),
            description: `🎲 I threw a dice and it turned out to be **${result}**.`,
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username,
                icon_url: '',
            },
        };

        await interaction.reply({embeds: [embed]});
    }
};