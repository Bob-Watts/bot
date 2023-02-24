'use strict';

const {SlashCommandBuilder} = require("discord.js");
const Guild = require("../../App/Services/GuildService");

const data = new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Return information about the server, such as the number of members, channels, and roles')

module.exports = {
    data: data,
    name: 'serverinfo',
    description: 'Return information about the server, such as the number of members, channels, and roles',
    execute: async (interaction) => {
        const GuildService = new Guild(interaction);
        const guild = await GuildService.getGuild();

        const [onlineMembersCount, premiumTier, notificationSettings, verificationLevel, roles, serverCreation, rulesChannel, systemChannel, isVerified] =
            await Promise.all([
                GuildService.getOnlineMembersCount(),
                GuildService.getPremiumTier(guild.premiumTier),
                GuildService.getNotificationSettings(guild.GuildSettings.defaultMessageNotifications),
                GuildService.getVerificationLevel(guild.GuildSettings.verificationLevel),
                GuildService.getRolesCount(),
                GuildService.getServerCreation(guild.createdTimestamp),
                GuildService.getRulesChannel(guild.GuildSettings.rulesChannelID),
                GuildService.getSystemChannel(guild.GuildSettings.systemChannelID),
                GuildService.checkIfGuildIsVerified(guild.verified),
            ]);

        const {emojis} = interaction.client;
        const serverOwnerEmoji = emojis.cache.get('952556627863683135');
        const nitroBadge = emojis.cache.get('952571786791366776');
        const hypesquadBadge = emojis.cache.get('909197289808093235');

        const embed = {
            color: parseInt('17a2b8', 16),
            title: guild.GuildSettings.name,
            description: guild.GuildSettings.description ?? 'This server does not have any description!',
            thumbnail: {
                url: `${guild.GuildSettings.iconURL}` ?? '',
            },
            fields: [
                {
                    name: `${serverOwnerEmoji} Server Owner`,
                    value: `<@${guild.GuildSettings.ownerID}>`,
                },
                {
                    name: '🆔 Owner ID',
                    value: `\`\`\`${guild.GuildSettings.ownerID}\`\`\``,
                    inline: true,
                },
                {
                    name: '🆔 Server ID',
                    value: `\`\`\`${guild.guildId}\`\`\``,
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: '📊 Member Count',
                    value: `\`\`\`${guild.memberCount}\`\`\``,
                    inline: true,
                },
                {
                    name: '🟢 Online Members',
                    value: `\`\`\`${onlineMembersCount}\`\`\``,
                    inline: true,
                },
                {
                    name: `${nitroBadge} Boosting Count`,
                    value: `\`\`\`${guild.premiumSubscriptionCount}\`\`\``,
                    inline: true,
                },
                {
                    name: `${hypesquadBadge} Premium Tier`,
                    value: `\`\`\`${premiumTier}\`\`\``,
                    inline: true,
                },
                {
                    name: '☑️ Verified Server',
                    value: `\`\`\`${isVerified}\`\`\``,
                    inline: true,
                },
                {
                    name: `📅 Server Created`,
                    value: `${serverCreation}`,
                    inline: true,
                },
                {
                    name: `📨 Rules`,
                    value: `${rulesChannel}`,
                    inline: false,
                },
                {
                    name: `📨 System Channel`,
                    value: `${systemChannel}`,
                    inline: false,
                },
                {
                    name: `📨 Notification Settings`,
                    value: `${notificationSettings}`,
                    inline: false,
                },
                {
                    name: `🎚️ Verification Level`,
                    value: `${verificationLevel}`,
                    inline: false,
                },
                {
                    name: `🎚️ Server Roles`,
                    value: `${roles}`,
                    inline: false,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username,
            },
        };

        await interaction.reply({embeds: [embed]});
    }
};