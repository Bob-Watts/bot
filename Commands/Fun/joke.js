'use strict';

const {SlashCommandBuilder} = require("discord.js");
const data = new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Generates a random joke.')

module.exports = {
    data: data,
    name: 'joke',
    description: 'Generates a random joke',
    execute: async (interaction) => {
        const jokes = [
            "Why did the tomato turn red? Because it saw the salad dressing!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why was the math book sad? Because it had too many problems!",
            "Why did the cookie go to the doctor? Because it was feeling crumbly!",
            "Why did the bicycle fall over? Because it was two-tired!",
            "Why did the computer go to the doctor? Because it had a virus!",
            "Why did the frog call his insurance company? He had a jump in his car."
        ];

        const randomIndex = Math.floor(Math.random() * jokes.length);

        const embed = {
            color: parseInt('17a2b8', 16),
            description: `:laughing: ${jokes[randomIndex]}`,
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username,
                icon_url: '',
            },
        };

        await interaction.reply({embeds: [embed]});
    }
};