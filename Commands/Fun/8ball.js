'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8ball a question and get an answer.')
    .addStringOption(option =>
        option.setName('question')
            .setDescription('The question you want to ask the magic 8ball.')
            .setRequired(true));

module.exports = {
    data: data,
    name: '8ball',
    description: 'Ask the magic 8ball a question and get an answer.',
    execute: async (interaction) => {
        const fortune = [
            'It is Certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful',
            'It’s looking pretty dodgy.',
            'I’d bet my bottom dollar on it.',
            'The stars are aligning for a positive outcome.',
            'I’m getting mixed signals, try again later.',
            'The universe is trying to tell you something, but I’m not sure what.',
            'Don’t hold your breath.',
            'If wishes were horses, beggars would ride.',
            'The outlook is hazy, just like your future.'
        ];

        let answer = Math.floor(Math.random() * fortune.length);

        const message = interaction.options.getString('question');

        const embed = {
            color: parseInt('17a2b8', 16),
            description: `:8ball: <@${interaction.user.id}>, ${fortune[answer]}`,
            footer: {
                text: `Original message: ${message}`
            }
        };

        await interaction.reply({embeds: [embed]});
    },
};