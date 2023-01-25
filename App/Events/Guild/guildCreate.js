'use strict';

module.exports = {
    name: 'guildCreate',
    once: false,
    execute: async (guild) => {
        console.log(`Joined a new guild: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    },
};