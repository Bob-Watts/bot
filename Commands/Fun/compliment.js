'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('compliment')
    .setDescription('Generates a random compliment to a selected user.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Choose a user to compliment.')
            .setRequired(true));

module.exports = {
    data: data,
    name: 'compliment',
    description: 'Generates a random compliment to a selected user.',
    execute: async (interaction) => {
        const user = interaction.options.getUser('user');

        if (!user) {
            return interaction.reply({ content: 'Could not find this user!', ephemeral: true });
        }

        const compliments = [
            "you're amazing!",
            "you're a true inspiration.",
            "you have a unique and beautiful spirit.",
            "you're so talented!",
            "you have a heart of gold.",
            "you're the best!",
        ];

        const compliment = compliments[Math.floor(Math.random() * compliments.length)];

        const embed = {
            color:       parseInt('17a2b8', 16),
            description: `:sparkles: <@${interaction.user.id}> thinks ${compliment} <@${user.id}>`,
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username,
                icon_url: ''
            }
        };

        await interaction.reply({ embeds: [embed] });
    }
};