'use strict';

const figlet = require('figlet');
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Converts text to ASCII art.')
    .addStringOption(option =>
        option.setName('text')
            .setDescription('The text you want to convert to ASCII art.')
            .setRequired(true));

module.exports = {
    data: data,
    name: 'ascii',
    description: 'Converts text to ASCII art.',
    execute: async (interaction) => {
        const message = interaction.options.getString('text');

        figlet(message, function (err, data) {
            if (err) {
                return interaction.reply({content: 'Something went wrong.', ephemeral: true});
            }

            const embed = {
                color: parseInt('17a2b8', 16),
                description: `\`\`\`${data}\`\`\``,
                footer: {
                    text: `Original message: ${message}`
                }
            };

            return interaction.reply({embeds: [embed]});
        });
    }
}