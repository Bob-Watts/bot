'use strict';

const {SlashCommandBuilder} = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('urban')
    .setDescription('Returns the definition of a word from an urban dictionary')
    .addStringOption(option =>
        option.setName('word')
            .setDescription('Please provide a word to search for.')
            .setRequired(true));

module.exports = {
    data: data,
    name: 'urban',
    description: 'Returns the definition of a word from an urban dictionary',
    execute: async (interaction) => {
        const word = interaction.options.getString('word');

        try {
            let response = await fetch(`https://api.urbandictionary.com/v0/define?term=${word}`);
            response = await response.json();
            const definition = response.list[0];

            if (!definition) {
                return interaction.reply({content: `No results found for **${word}**`, ephemeral: true});
            }

            // Remove brackets from definition
            const cleanedDefinition = definition.definition.replace(/[\[\]]/g, '');

            const embed = {
                color: parseInt('17a2b8', 16),
                title: definition.word,
                url: definition.permalink,
                description: cleanedDefinition,
                fields: [
                    {
                        name: 'Example',
                        value: definition.example || '**No example provided.**',
                    },
                    {
                        name: 'Rating',
                        value: `**${definition.thumbs_up}** thumbs up. **${definition.thumbs_down}** thumbs down.`,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: interaction.client.user.username,
                    icon_url: '',
                }
            };

            await interaction.reply({embeds: [embed]});
        } catch (error) {
            interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            console.error(error);
        }
    }
};