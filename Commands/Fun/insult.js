'use strict';

const {SlashCommandBuilder} = require("discord.js");
const data = new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Insult a user of your choice.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Choose a user to insult.')
            .setRequired(true));

module.exports = {
    data: data,
    name: 'insult',
    description: 'Insult a user of your choice.',
    execute: async (interaction) => {
        const insults = [
            "you're a disgrace to your family.",
            "you're a waste of oxygen.",
            "you're as useful as a screen door on a submarine.",
            "you're a sorry excuse for a human being.",
            "you're as dumb as a rock.",
            "you have the intelligence of a doorknob.",
            "you're a complete failure in life.",
            "you have the charisma of a dead fish."
        ];

        const randomIndex = Math.floor(Math.random() * insults.length);

        const embed = {
            color: parseInt('17a2b8', 16),
            description: `:no_entry_sign: <@${interaction.user.id}> thinks ${insults[randomIndex]} <@${interaction.options.getUser('user').id}>`,
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username,
                icon_url: '',
            },
        };

        await interaction.reply({embeds: [embed]});
    }
};