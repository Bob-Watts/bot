'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('randomuser')
    .setDescription('Returns a random user from the server with some information about them.');

module.exports = {
    data: data,
    name: 'randomuser',
    description: 'Returns a random user from the server with some information',
    execute: async (interaction) => {
        const flags = {
            DISCORD_EMPLOYEE:            interaction.client.emojis.cache.get('909196883514241068'),
            PARTNERED_SERVER_OWNER:      interaction.client.emojis.cache.get('909196883560390758'),
            BUGHUNTER_LEVEL_1:           interaction.client.emojis.cache.get('909196883916914788'),
            BUGHUNTER_LEVEL_2:           interaction.client.emojis.cache.get('909196883971428382'),
            HYPESQUAD_EVENTS:            interaction.client.emojis.cache.get('909197289808093235'),
            HOUSE_BRAVERY:               interaction.client.emojis.cache.get('909196883862388756'),
            HOUSE_BRILLIANCE:            interaction.client.emojis.cache.get('909196883510038620'),
            HOUSE_BALANCE:               interaction.client.emojis.cache.get('909196883824635944'),
            EARLY_SUPPORTER:             interaction.client.emojis.cache.get('909196883916898344'),
            VERIFIED_DEVELOPER:          interaction.client.emojis.cache.get('909196883853991956'),
            DISCORD_CERTIFIED_MODERATOR: interaction.client.emojis.cache.get('909196883820433418'),
            TEAM_USER:                   'Team User',
            SYSTEM:                      'System',
            VERIFIED_BOT:                'Verified Bot',
        };
        const randomUser = interaction.guild.members.cache.random();

        let createdAt = new Date(randomUser.user.createdTimestamp).toLocaleString();
        let date = new Date(randomUser.joinedAt).toLocaleString();
        const userFlags = randomUser.user.flags.toArray();

        let userBadges;
        if (userFlags.length === 1) {
            userBadges = userFlags.map(flag => flags[flag]).join(', ');
        } else {
            userBadges = 'None';
        }

        let roles = randomUser.roles.cache.map(roles => `<@&${roles.id}>`);
        roles.pop();

        const embed = {
            title:       `${randomUser.user.tag} | ${randomUser.user.id}`,
            thumbnail:   {
                url: randomUser.user.displayAvatarURL({ dynamic: true })
            },
            description: `Here is the information about <@${randomUser.user.id}>`,
            fields:      [
                {
                    name:   '\u200b',
                    value:  '\u200b',
                    inline: false,
                },
                {
                    name:   'User ID',
                    value:  `\`${randomUser.user.id}\``,
                    inline: true
                },
                {
                    name:   'Username',
                    value:  `\`${randomUser.user.tag}\``,
                    inline: true
                },
                {
                    name:   'Highest Role',
                    value:  `${randomUser.roles.highest.id === interaction.guild.id ? 'None' : randomUser.roles.highest.name}`,
                    inline: true
                },
                {
                    name:   'Joined Discord',
                    value:  `\`${createdAt}\``,
                    inline: true
                },
                {
                    name:   'Member Since',
                    value:  `\`${date}\``,
                    inline: true
                },
                {
                    name:   'Badge(s)',
                    value:  `${userBadges.toString()}`,
                    inline: true
                },
                {
                    name:   'Roles',
                    value:  `${roles.length ? roles.join(', ') : 'This user has no roles'.toString()}`,
                    inline: false
                },
            ],
            timestamp:   new Date(),
            footer:      {
                text: interaction.client.user.username
            },
        };

        await interaction.reply({ embeds: [embed] });
    }
};