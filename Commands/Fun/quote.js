'use strict';

const {SlashCommandBuilder} = require("discord.js");
const data = new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Generates a random quote.')

module.exports = {
    data: data,
    name: 'quote',
    description: 'Generates a random quote',
    execute: async (interaction) => {
        const quotes = [
            "The greatest glory in living lies not in never falling, but in rising every time we fall.",
            "Don't watch the clock; do what it does. Keep going.",
            "The way to get started is to quit talking and begin doing.",
            "Believe you can and you're halfway there.",
            "It does not matter how slowly you go as long as you do not stop.",
            "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            "Successful and unsuccessful people do not vary greatly in their abilities. They vary in their desires to reach their potential.",
            "It's not the years in your life that count. It's the life in your years."
        ];

        const randomIndex = Math.floor(Math.random() * quotes.length);

        const embed = {
            color: parseInt('17a2b8', 16),
            description: `:sparkles: ${quotes[randomIndex]}`,
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username,
                icon_url: '',
            },
        };

        await interaction.reply({embeds: [embed]});
    }
};