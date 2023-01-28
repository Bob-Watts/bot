'use strict';

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class Message {
    constructor(message) {
        this.message = message;
    }

    async getMessage() {
        // Get the user from the database
        const getUser = await prisma.users.findFirst({
            where: {
                accountId: this.message.author.id,
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
        if (this.message.guild.available) {
            // Get the guild from the database
            const getGuild = await prisma.guilds.findFirst({
                where: {
                    guildId: this.message.guild.id,
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
                    memberId: this.message.member.id,
                }
            });

            // If the guild member doesn't exist, create them
            // Otherwise, update them
            if (!getGuildMember) {
                await this.createGuildMember();
            } else {
                await this.updateGuildMember();
            }

            if (this.message.channel.isThread()) {
                // Get the thread from the database
                const getThread = await prisma.ThreadChannels.findFirst({
                    where: {
                        threadId: this.message.channel.id,
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
                        channelId: this.message.channel.id,
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
                        channelId: this.message.channel.id,
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
        let createdTimestamp = this.message.author.createdTimestamp;
        let date = new Date(createdTimestamp);
        let formattedTimestamp = date.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.users.create({
            data: {
                accountId: this.message.author.id,
                username: this.message.author.username,
                discriminator: this.message.author.discriminator,
                avatar: this.message.author.avatar,
                bot: this.message.author.bot,
                createdTimestamp: formattedTimestamp,
            }
        });
    }

    // Update an existing user
    async updateUser() {
        let createdTimestamp = this.message.author.createdTimestamp;
        let date = new Date(createdTimestamp);
        let formattedTimestamp = date.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.users.update({
            where: {
                accountId: this.message.author.id,
            },
            data: {
                username: this.message.author.username,
                discriminator: this.message.author.discriminator,
                avatar: this.message.author.avatar,
                bot: this.message.author.bot,
                createdTimestamp: formattedTimestamp,
            }
        });
    }

    // Create a new guild
    async createGuild() {
        let createdTimestamp = this.message.guild.createdTimestamp;
        let createdDate = new Date(createdTimestamp);
        let createdFormattedTimestamp = createdDate.toISOString().slice(0, 19).replace('T', ' ');

        let joinedTimestamp = this.message.guild.createdTimestamp;
        let joinedDate = new Date(joinedTimestamp);
        let joinedFormattedTimestamp = joinedDate.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.guilds.create({
            data: {
                guildId: this.message.guild.id,
                available: this.message.guild.available,
                createdTimestamp: createdFormattedTimestamp,
                joinedTimestamp: joinedFormattedTimestamp,
                large: this.message.guild.large,
                maximumMembers: this.message.guild.maximumMembers,
                maximumPresences: this.message.guild.maximumPresences,
                memberCount: this.message.guild.memberCount,
                partnered: this.message.guild.partnered,
                premiumSubscriptionCount: this.message.guild.premiumSubscriptionCount,
                premiumTier: this.message.guild.premiumTier.toString(),
                verified: this.message.guild.verified,

                GuildSettings: {
                    create: {
                        afkChannelID: this.message.guild.afkChannelId,
                        afkTimeout: this.message.guild.afkTimeout,
                        bannerURL: this.message.guild.bannerURL({dynamic: true}),
                        defaultMessageNotifications: this.message.guild.defaultMessageNotifications.toString(),
                        description: this.message.guild.description,
                        explicitContentFilter: this.message.guild.explicitContentFilter.toString(),
                        iconURL: this.message.guild.iconURL({dynamic: true}),
                        mfaLevel: this.message.guild.mfaLevel.toString(),
                        name: this.message.guild.name,
                        nameAcronym: this.message.guild.nameAcronym,
                        ownerID: this.message.guild.ownerId,
                        preferredLocale: this.message.guild.preferredLocale,
                        rulesChannelID: this.message.guild.rulesChannelId,
                        shardID: this.message.guild.shardId,
                        splashURL: this.message.guild.splashURL(),
                        systemChannelID: this.message.guild.systemChannelId,
                        publicUpdatesChannelId: this.message.guild.publicUpdatesChannelId,
                        vanityURLCode: this.message.guild.vanityURLCode,
                        verificationLevel: this.message.guild.verificationLevel.toString(),
                    }
                }
            }
        });
    }

    // Update an existing guild
    async updateGuild() {
        await prisma.guilds.update({
            where: {
                guildId: this.message.guild.id,
            },
            data: {
                available: this.message.guild.available,
                large: this.message.guild.large,
                maximumMembers: this.message.guild.maximumMembers,
                maximumPresences: this.message.guild.maximumPresences,
                memberCount: this.message.guild.memberCount,
                partnered: this.message.guild.partnered,
                premiumSubscriptionCount: this.message.guild.premiumSubscriptionCount,
                premiumTier: this.message.guild.premiumTier.toString(),
                verified: this.message.guild.verified,

                GuildSettings: {
                    update: {
                        afkChannelID: this.message.guild.afkChannelId,
                        afkTimeout: this.message.guild.afkTimeout,
                        bannerURL: this.message.guild.bannerURL({dynamic: true}),
                        defaultMessageNotifications: this.message.guild.defaultMessageNotifications.toString(),
                        description: this.message.guild.description,
                        explicitContentFilter: this.message.guild.explicitContentFilter.toString(),
                        iconURL: this.message.guild.iconURL({dynamic: true}),
                        mfaLevel: this.message.guild.mfaLevel.toString(),
                        name: this.message.guild.name,
                        nameAcronym: this.message.guild.nameAcronym,
                        ownerID: this.message.guild.ownerId,
                        preferredLocale: this.message.guild.preferredLocale,
                        rulesChannelID: this.message.guild.rulesChannelId,
                        shardID: this.message.guild.shardId,
                        splashURL: this.message.guild.splashURL(),
                        systemChannelID: this.message.guild.systemChannelId,
                        publicUpdatesChannelId: this.message.guild.publicUpdatesChannelId,
                        vanityURLCode: this.message.guild.vanityURLCode,
                        verificationLevel: this.message.guild.verificationLevel.toString(),
                    }
                }
            }
        });
    }

    // Create a new guild member
    async createGuildMember() {
        let joinedTimestamp = this.message.member.joinedTimestamp;
        let joinedDate = new Date(joinedTimestamp);
        let joinedFormattedTimestamp = joinedDate.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.guildMembers.create({
            data: {
                guildId: this.message.member.guild.id,
                accountId: this.message.author.id,
                memberId: this.message.member.id,
                bannable: this.message.member.bannable,
                displayColor: this.message.member.displayColor,
                displayHexColor: this.message.member.displayHexColor,
                displayName: this.message.member.displayName,
                joinedTimestamp: joinedFormattedTimestamp,
                kickable: this.message.member.kickable,
                manageable: this.message.member.manageable,
                nickname: this.message.member.nickname,
                premiumSinceTimestamp: this.message.member.premiumSinceTimestamp,
            }
        });
    }

    // Update an existing guild member
    async updateGuildMember() {
        await prisma.guildMembers.update({
            where: {
                memberId: this.message.member.id,
            },
            data: {
                bannable: this.message.member.bannable,
                displayColor: this.message.member.displayColor,
                displayHexColor: this.message.member.displayHexColor,
                displayName: this.message.member.displayName,
                kickable: this.message.member.kickable,
                manageable: this.message.member.manageable,
                nickname: this.message.member.nickname,
                premiumSinceTimestamp: this.message.member.premiumSinceTimestamp,
            }
        });
    }

    // Create thread channel
    async createThread() {
        let createdTimestamp = this.message.channel.createdTimestamp;
        let createdDate = new Date(createdTimestamp);
        let createdFormattedTimestamp = createdDate.toISOString().slice(0, 19).replace('T', ' ');

        let archiveTimestamp = this.message.channel.archiveTimestamp;
        let archiveDate = new Date(archiveTimestamp);
        let archiveFormattedTimestamp = archiveDate.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.ThreadChannels.create({
            data: {
                threadId: this.message.channel.id,
                ownerId: this.message.channel.ownerId,
                guildId: this.message.guild.id,
                threadName: this.message.channel.name,
                archived: this.message.channel.archived,
                archivedAt: this.message.channel.archivedAt,
                archivedTimestamp: archiveFormattedTimestamp,
                autoArchiveDuration: this.message.channel.autoArchiveDuration,
                createdTimestamp: createdFormattedTimestamp,
                editable: this.message.channel.editable,
                invitable: this.message.channel.invitable,
                joinable: this.message.channel.joinable,
                joined: this.message.channel.joined,
                locked: this.message.channel.locked,
                manageable: this.message.channel.manageable,
                memberCount: this.message.channel.memberCount,
                type: this.message.channel.type.toString(),
                unarchivable: this.message.channel.unarchivable,
            },
        });
    }

    // Update thread channel
    async updateThread() {
        await prisma.ThreadChannels.update({
            where: {
                threadId: this.message.channel.id,
            },
            data: {
                threadName: this.message.channel.name,
                archived: this.message.channel.archived,
                archivedAt: this.message.channel.archivedAt,
                autoArchiveDuration: this.message.channel.autoArchiveDuration,
                editable: this.message.channel.editable,
                invitable: this.message.channel.invitable,
                joinable: this.message.channel.joinable,
                joined: this.message.channel.joined,
                locked: this.message.channel.locked,
                manageable: this.message.channel.manageable,
                memberCount: this.message.channel.memberCount,
                type: this.message.channel.type.toString(),
                unarchivable: this.message.channel.unarchivable,
            },
        });
    }

    // Create a new channel
    async createChannel() {
        let createdTimestamp = this.message.channel.createdTimestamp;
        let createdDate = new Date(createdTimestamp);
        let createdFormattedTimestamp = createdDate.toISOString().slice(0, 19).replace('T', ' ');

        await prisma.channels.create({
            data: {
                channelId: this.message.channel.id,
                name: this.message.channel.name,
                nsfw: this.message.channel.nsfw,
                topic: this.message.channel.topic,
                type: this.message.channel.type.toString(),
                createdTimestamp: createdFormattedTimestamp,
            }
        });
    }

    // Update an existing channel
    async updateChannel() {
        await prisma.channels.update({
            where: {
                channelId: this.message.channel.id,
            },
            data: {
                name: this.message.channel.name,
                nsfw: this.message.channel.nsfw,
                topic: this.message.channel.topic,
                type: this.message.channel.type.toString(),
            }
        });
    }

    async createGuildChannel() {
        await prisma.guildChannels.create({
            data: {
                guildId: this.message.guild.id,
                channelId: this.message.channel.id,
                name: this.message.channel.name,
                deletable: this.message.channel.deletable,
                manageable: this.message.channel.manageable,
                parentId: this.message.channel.parentId,
                permissionsLocked: this.message.channel.permissionsLocked,
                position: this.message.channel.position,
                rawPosition: this.message.channel.rawPosition,
                viewable: this.message.channel.viewable,
            }
        });
    }

    async updateGuildChannel() {
        await prisma.guildChannels.update({
            where: {
                channelId: this.message.channel.id,
            },
            data: {
                name: this.message.channel.name,
                deletable: this.message.channel.deletable,
                manageable: this.message.channel.manageable,
                parentId: this.message.channel.parentId,
                permissionsLocked: this.message.channel.permissionsLocked,
                position: this.message.channel.position,
                rawPosition: this.message.channel.rawPosition,
                viewable: this.message.channel.viewable,
            }
        });
    }
}

module.exports = Message;