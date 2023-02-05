'use strict';

const {SlashCommandBuilder} = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Game: Rock, Paper, Scissors')
    .addStringOption(option =>
        option.setName('tool')
            .setDescription('Your tools use one of the following: rock, paper, scissors')
            .addChoices({
                    "name": 'Rock',
                    "value": "rock"
                },
                {
                    "name": "Paper",
                    "value": "paper"
                },
                {
                    "name": "Scissors",
                    "value": "scissors"
                })
            .setRequired(true));

module.exports = {
    data: data,
    name: 'rps',
    description: `Game: Rock, Paper, Scissors`,
    execute: async (interaction) => {
        const tool = interaction.options.getString('tool')

        let toolArray = ['rock', 'paper', 'scissors'];

        let responseMessage = '';
        let gameResult = '';

        // Generate random answer
        let answer = toolArray[Math.floor(Math.random() * toolArray.length)];

        if (tool === answer) {
            gameResult = 'draw';
        } else if ((tool === 'rock' && answer === 'scissors') ||
            (tool === 'scissors' && answer === 'paper') ||
            (tool === 'paper' && answer === 'rock')) {
            gameResult = 'win';
        } else {
            gameResult = 'lose';
        }

        // Formulate response message
        switch (gameResult) {
            case 'draw':
                responseMessage = `<@${interaction.user.id}>, we have a draw. My hand was **${answer}**`;
                break;
            case 'win':
                responseMessage = `<@${interaction.user.id}>, you won! My hand was **${answer}**`;
                break;
            case 'lose':
                responseMessage = `<@${interaction.user.id}>, you lost. My hand was **${answer}**`;
                break;
        }

        let embed = {
            color: parseInt('17a2b8', 16),
            description: `${responseMessage}`,
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username
            }
        };

        await interaction.reply({embeds: [embed]});
    },
};