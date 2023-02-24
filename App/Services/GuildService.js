'use strict';

const Interaction = require("../Discord/Interaction");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Guild service, used to get guild information from the database and the Discord API
 */
class GuildService {
    constructor(interaction) {
        this.interaction = interaction;
    }

    /**
     * Get a guild from the database
     * @returns {Promise<Guild>}
     */
    async getGuild() {
        const guild = await prisma.guilds.findFirst({
            where: {
                guildId: this.interaction.guild.id
            },
            include: {
                GuildSettings: true
            }
        });

        if (!guild) {
            const interactionClass = new Interaction(this.interaction);
            await interactionClass.createGuild();
        }

        return guild;
    }

    /**
     * Get the amount of online members in the guild (combined online and do not disturb)
     *
     * @returns {Promise<number>}
     */
    async getOnlineMembersCount() {
        const guild = await this.interaction.client.guilds.fetch(this.interaction.guild.id, {withPresences: true});
        const online = guild.members.cache.filter((member) => member.presence?.status === 'online').size;
        const dnd = guild.members.cache.filter((member) => member.presence?.status === 'dnd').size;

        return online + dnd;
    }

    /**
     * Get the premium tier of the guild
     *
     * @param premiumTier
     * @returns {Promise<*>}
     */
    async getPremiumTier(premiumTier) {
        return {
            0: 'Tier 0',
            1: 'Tier 1',
            2: 'Tier 2',
            3: 'Tier 3'
        }[premiumTier];
    }

    /**
     * Get the notification settings of the guild
     *
     * @param notificationSettings
     * @returns {Promise<*>}
     */
    async getNotificationSettings(notificationSettings) {
        return {
            0: 'Receive notifications for all messages by default',
            1: 'Receive notifications only for @mentions'
        }[notificationSettings];
    }

    /**
     * Get the verification level of the guild
     *
     * @param verificationLevel
     * @returns {Promise<*>}
     */
    async getVerificationLevel(verificationLevel) {
        return {
            0: 'Unrestricted verification level',
            1: 'Must have verified email on Discord account',
            2: 'Must be registered on Discord for longer than 5 minutes',
            3: 'Must be a member of the server for longer than 10 minutes',
            4: 'Must have a verified phone number on Discord account'
        }[verificationLevel];
    }

    /**
     * Get the rules channel of the guild
     *
     * @param channelId
     * @returns {Promise<string|string>}
     */
    async getRulesChannel(channelId) {
        const rulesChannel = this.interaction.guild.channels.cache.get(channelId);
        return rulesChannel ? `<#${rulesChannel.id}>` : 'Rules channel has not been setup!';
    }

    /**
     * Get the system channel of the guild
     *
     * @param channelId
     * @returns {Promise<string|string>}
     */
    async getSystemChannel(channelId) {
        const systemChannel = this.interaction.guild.channels.cache.get(channelId);
        return systemChannel ? `<#${systemChannel.id}>` : 'System channel has not been setup!';
    }

    /**
     * Get how many roles the guild has
     *
     * @returns {Promise<string|*>}
     */
    async getRolesCount() {
        const roles = this.interaction.guild.roles.cache.map((role) => `<@&${role.id}>`).slice(1);
        return roles.length > 10 ? `This server has **${roles.length}** roles` : roles.join(', ');
    }

    /**
     * Get the creation timestamp of the guild and convert it to a human-readable format
     * @param createdTimestamp
     * @returns {Promise<string>}
     */
    async getServerCreation(createdTimestamp) {
        const unixTimestamp = (new Date(createdTimestamp).getTime() / 1000).toFixed(0);
        return `<t:${unixTimestamp}:R>`;
    }

    /**
     * Check if the guild is verified or not
     *
     * @param verified
     * @returns {Promise<string>}
     */
    async checkIfGuildIsVerified(verified) {
        return verified ? 'Yes' : 'No';
    }
}

module.exports = GuildService;