'use strict';

module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    execute: async (interaction) => {
        const ping = interaction.client.ws.ping
        const embedColor = ping <= 450 ? '28a745' : (ping < 750 ? 'FF6000' : 'dc3545');
        const pingEmbed = {
            color: parseInt(embedColor, 16),
            description: `🏓 Pong - ${Math.floor(ping).toLocaleString()} milliseconds.`,
            timestamp: new Date(),
            footer: {
                text: interaction.client.user.username,
                icon_url: ''
            }
        };

        await interaction.reply({ embeds: [pingEmbed] });
    }
};