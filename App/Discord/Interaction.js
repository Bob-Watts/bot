'use strict';

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * This class is used to handle interactions.
 */
class Interaction {
    constructor(interaction) {
        this.interaction = interaction;
    }

    async getInteraction() {
        // Get the user from the database
        const getUser = await prisma.users.findFirst({
            where: {
                accountId: this.interaction.user.id,
            }
        });

        // If the user doesn't exist, create them
        // Otherwise, update them
        if (!getUser) {
            await this.createUser();
        } else {
            await this.updateUser();
        }

        // Check if the guild is available
        if (this.interaction.guild.available) {
            // Get the guild from the database
            const getGuild = await prisma.guilds.findFirst({
                where: {
                    guildId: this.interaction.guild.id,
                }
            });

            // If the guild doesn't exist, create it
            // Otherwise, update it
            if (!getGuild) {
                await this.createGuild();
            } else {
                await this.updateGuild();
            }

            // Get the guild member from the database
            const getGuildMember = await prisma.guildMembers.findFirst({
                where: {
                    memberId: this.interaction.member.id,
                }
            });

            // If the guild member doesn't exist, create them
            // Otherwise, update them
            if (!getGuildMember) {
                await this.createGuildMember();
            } else {
                await this.updateGuildMember();
            }

            if (this.interaction.channel.isThread()) {
                // Get the thread from the database
                const getThread = await prisma.ThreadChannels.findFirst({
                    where: {
                        threadId: this.interaction.channel.id,
                    }
                });

                // If the thread doesn't exist, create it
                // Otherwise, update it
                if (!getThread) {
                    await this.createThread();
                } else {
                    await this.updateThread();
                }
            } else {
                // Get the channel from the database
                const getChannel = await prisma.channels.findFirst({
                    where: {
                        channelId: this.interaction.channel.id,
                    }
                });

                // If the channel doesn't exist, create it
                // Otherwise, update it
                if (!getChannel) {
                    await this.createChannel();
                } else {
                    await this.updateChannel();
                }

                // Get the guild channel from the database
                const getGuildChannel = await prisma.GuildChannels.findFirst({
                    where: {
                        channelId: this.interaction.channel.id,
                    },
                });

                // If the guild channel doesn't exist, create it
                // Otherwise, update it
                if (!getGuildChannel) {
                    await this.createGuildChannel();
                } else {
                    await this.updateGuildChannel();
                }
            }
        }
    }

    // Create a new user
    async createUser() {
        let createdTimestamp = this.interaction.user.createdTimestamp;
        let date = new Date(createdTimestamp);
        let formattedTimestamp = date.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.users.create({
            data: {
                accountId: this.interaction.user.id,
                username: this.interaction.user.username,
                discriminator: this.interaction.user.discriminator,
                avatar: this.interaction.user.avatar,
                bot: this.interaction.user.bot,
                createdTimestamp: formattedTimestamp,
            }
        });
    }

    // Update an existing user
    async updateUser() {
        let createdTimestamp = this.interaction.user.createdTimestamp;
        let date = new Date(createdTimestamp);
        let formattedTimestamp = date.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.users.update({
            where: {
                accountId: this.interaction.user.id,
            },
            data: {
                username: this.interaction.user.username,
                discriminator: this.interaction.user.discriminator,
                avatar: this.interaction.user.avatar,
                bot: this.interaction.user.bot,
                createdTimestamp: formattedTimestamp,
            }
        });
    }

    // Create a new guild
    async createGuild() {
        let createdTimestamp = this.interaction.guild.createdTimestamp;
        let createdDate = new Date(createdTimestamp);
        let createdFormattedTimestamp = createdDate.toISOString().slice(0, 19).replace('T', ' ');

        let joinedTimestamp = this.interaction.guild.createdTimestamp;
        let joinedDate = new Date(joinedTimestamp);
        let joinedFormattedTimestamp = joinedDate.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.guilds.create({
            data: {
                guildId: this.interaction.guild.id,
                available: this.interaction.guild.available,
                createdTimestamp: createdFormattedTimestamp,
                joinedTimestamp: joinedFormattedTimestamp,
                large: this.interaction.guild.large,
                maximumMembers: this.interaction.guild.maximumMembers,
                maximumPresences: this.interaction.guild.maximumPresences,
                memberCount: this.interaction.guild.memberCount,
                partnered: this.interaction.guild.partnered,
                premiumSubscriptionCount: this.interaction.guild.premiumSubscriptionCount,
                premiumTier: this.interaction.guild.premiumTier.toString(),
                verified: this.interaction.guild.verified,

                GuildSettings: {
                    create: {
                        afkChannelID: this.interaction.guild.afkChannelId,
                        afkTimeout: this.interaction.guild.afkTimeout,
                        bannerURL: this.interaction.guild.bannerURL({dynamic: true}),
                        defaultMessageNotifications: this.interaction.guild.defaultMessageNotifications.toString(),
                        description: this.interaction.guild.description,
                        explicitContentFilter: this.interaction.guild.explicitContentFilter.toString(),
                        iconURL: this.interaction.guild.iconURL({dynamic: true}),
                        mfaLevel: this.interaction.guild.mfaLevel.toString(),
                        name: this.interaction.guild.name,
                        nameAcronym: this.interaction.guild.nameAcronym,
                        ownerID: this.interaction.guild.ownerId,
                        preferredLocale: this.interaction.guild.preferredLocale,
                        rulesChannelID: this.interaction.guild.rulesChannelId,
                        shardID: this.interaction.guild.shardId,
                        splashURL: this.interaction.guild.splashURL(),
                        systemChannelID: this.interaction.guild.systemChannelId,
                        publicUpdatesChannelId: this.interaction.guild.publicUpdatesChannelId,
                        vanityURLCode: this.interaction.guild.vanityURLCode,
                        verificationLevel: this.interaction.guild.verificationLevel.toString(),
                    }
                }
            }
        });
    }

    // Update an existing guild
    async updateGuild() {
        await prisma.guilds.update({
            where: {
                guildId: this.interaction.guild.id,
            },
            data: {
                available: this.interaction.guild.available,
                large: this.interaction.guild.large,
                maximumMembers: this.interaction.guild.maximumMembers,
                maximumPresences: this.interaction.guild.maximumPresences,
                memberCount: this.interaction.guild.memberCount,
                partnered: this.interaction.guild.partnered,
                premiumSubscriptionCount: this.interaction.guild.premiumSubscriptionCount,
                premiumTier: this.interaction.guild.premiumTier.toString(),
                verified: this.interaction.guild.verified,

                GuildSettings: {
                    update: {
                        afkChannelID: this.interaction.guild.afkChannelId,
                        afkTimeout: this.interaction.guild.afkTimeout,
                        bannerURL: this.interaction.guild.bannerURL({dynamic: true}),
                        defaultMessageNotifications: this.interaction.guild.defaultMessageNotifications.toString(),
                        description: this.interaction.guild.description,
                        explicitContentFilter: this.interaction.guild.explicitContentFilter.toString(),
                        iconURL: this.interaction.guild.iconURL({dynamic: true}),
                        mfaLevel: this.interaction.guild.mfaLevel.toString(),
                        name: this.interaction.guild.name,
                        nameAcronym: this.interaction.guild.nameAcronym,
                        ownerID: this.interaction.guild.ownerId,
                        preferredLocale: this.interaction.guild.preferredLocale,
                        rulesChannelID: this.interaction.guild.rulesChannelId,
                        shardID: this.interaction.guild.shardId,
                        splashURL: this.interaction.guild.splashURL(),
                        systemChannelID: this.interaction.guild.systemChannelId,
                        publicUpdatesChannelId: this.interaction.guild.publicUpdatesChannelId,
                        vanityURLCode: this.interaction.guild.vanityURLCode,
                        verificationLevel: this.interaction.guild.verificationLevel.toString(),
                    }
                }
            }
        });
    }

    // Create a new guild member
    async createGuildMember() {
        let joinedTimestamp = this.interaction.member.joinedTimestamp;
        let joinedDate = new Date(joinedTimestamp);
        let joinedFormattedTimestamp = joinedDate.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.guildMembers.create({
            data: {
                guildId: this.interaction.member.guild.id,
                accountId: this.interaction.user.id,
                memberId: this.interaction.member.id,
                bannable: this.interaction.member.bannable,
                displayColor: this.interaction.member.displayColor,
                displayHexColor: this.interaction.member.displayHexColor,
                displayName: this.interaction.member.displayName,
                joinedTimestamp: joinedFormattedTimestamp,
                kickable: this.interaction.member.kickable,
                manageable: this.interaction.member.manageable,
                nickname: this.interaction.member.nickname,
                premiumSinceTimestamp: this.interaction.member.premiumSinceTimestamp,
            }
        });
    }

    // Update an existing guild member
    async updateGuildMember() {
        await prisma.guildMembers.update({
            where: {
                memberId: this.interaction.member.id,
            },
            data: {
                bannable: this.interaction.member.bannable,
                displayColor: this.interaction.member.displayColor,
                displayHexColor: this.interaction.member.displayHexColor,
                displayName: this.interaction.member.displayName,
                kickable: this.interaction.member.kickable,
                manageable: this.interaction.member.manageable,
                nickname: this.interaction.member.nickname,
                premiumSinceTimestamp: this.interaction.member.premiumSinceTimestamp,
            }
        });
    }

    // Create thread channel
    async createThread() {
        let createdTimestamp = this.interaction.channel.createdTimestamp;
        let createdDate = new Date(createdTimestamp);
        let createdFormattedTimestamp = createdDate.toISOString().slice(0, 19).replace('T', ' ');

        let archiveTimestamp = this.interaction.channel.archiveTimestamp;
        let archiveDate = new Date(archiveTimestamp);
        let archiveFormattedTimestamp = archiveDate.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.ThreadChannels.create({
            data: {
                threadId: this.interaction.channel.id,
                ownerId: this.interaction.channel.ownerId,
                guildId: this.interaction.guild.id,
                threadName: this.interaction.channel.name,
                archived: this.interaction.channel.archived,
                archivedAt: this.interaction.channel.archivedAt,
                archivedTimestamp: archiveFormattedTimestamp,
                autoArchiveDuration: this.interaction.channel.autoArchiveDuration,
                createdTimestamp: createdFormattedTimestamp,
                editable: this.interaction.channel.editable,
                invitable: this.interaction.channel.invitable,
                joinable: this.interaction.channel.joinable,
                joined: this.interaction.channel.joined,
                locked: this.interaction.channel.locked,
                manageable: this.interaction.channel.manageable,
                memberCount: this.interaction.channel.memberCount,
                type: this.interaction.channel.type.toString(),
                unarchivable: this.interaction.channel.unarchivable,
            },
        });
    }

    // Update thread channel
    async updateThread() {
        await prisma.ThreadChannels.update({
            where: {
                threadId: this.interaction.channel.id,
            },
            data: {
                threadName: this.interaction.channel.name,
                archived: this.interaction.channel.archived,
                archivedAt: this.interaction.channel.archivedAt,
                autoArchiveDuration: this.interaction.channel.autoArchiveDuration,
                editable: this.interaction.channel.editable,
                invitable: this.interaction.channel.invitable,
                joinable: this.interaction.channel.joinable,
                joined: this.interaction.channel.joined,
                locked: this.interaction.channel.locked,
                manageable: this.interaction.channel.manageable,
                memberCount: this.interaction.channel.memberCount,
                type: this.interaction.channel.type.toString(),
                unarchivable: this.interaction.channel.unarchivable,
            },
        });
    }

    // Create a new channel
    async createChannel() {
        let createdTimestamp = this.interaction.channel.createdTimestamp;
        let createdDate = new Date(createdTimestamp);
        let createdFormattedTimestamp = createdDate.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.channels.create({
            data: {
                channelId: this.interaction.channel.id,
                name: this.interaction.channel.name,
                nsfw: this.interaction.channel.nsfw,
                topic: this.interaction.channel.topic,
                type: this.interaction.channel.type.toString(),
                createdTimestamp: createdFormattedTimestamp,
            }
        });
    }

    // Update an existing channel
    async updateChannel() {
        await prisma.channels.update({
            where: {
                channelId: this.interaction.channel.id,
            },
            data: {
                name: this.interaction.channel.name,
                nsfw: this.interaction.channel.nsfw,
                topic: this.interaction.channel.topic,
                type: this.interaction.channel.type.toString(),
            }
        });
    }

    async createGuildChannel() {
        await prisma.guildChannels.create({
            data: {
                guildId: this.interaction.guild.id,
                channelId: this.interaction.channel.id,
                name: this.interaction.channel.name,
                deletable: this.interaction.channel.deletable,
                manageable: this.interaction.channel.manageable,
                parentId: this.interaction.channel.parentId,
                permissionsLocked: this.interaction.channel.permissionsLocked,
                position: this.interaction.channel.position,
                rawPosition: this.interaction.channel.rawPosition,
                viewable: this.interaction.channel.viewable,
            }
        });
    }

    async updateGuildChannel() {
        await prisma.guildChannels.update({
            where: {
                channelId: this.interaction.channel.id,
            },
            data: {
                name: this.interaction.channel.name,
                deletable: this.interaction.channel.deletable,
                manageable: this.interaction.channel.manageable,
                parentId: this.interaction.channel.parentId,
                permissionsLocked: this.interaction.channel.permissionsLocked,
                position: this.interaction.channel.position,
                rawPosition: this.interaction.channel.rawPosition,
                viewable: this.interaction.channel.viewable,
            }
        });
    }
}

module.exports = Interaction;