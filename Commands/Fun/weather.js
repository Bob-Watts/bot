'use strict';

require('dotenv').config();

const {SlashCommandBuilder} = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get the current weather forecast for a location')
    .addStringOption(option =>
        option.setName('location')
            .setDescription('Choose the location where you want weather forecast from!')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('units')
            .setDescription('Your tools use one of the following: rock, paper, scissors')
            .addChoices({
                    "name": 'Metric (Celsius)',
                    "value": "metric"
                },
                {
                    "name": "Imperial (Fahrenheit)",
                    "value": "imperial"
                },
                {
                    "name": "Kelvin",
                    "value": "kelvin"
                })
            .setRequired(true)
    );

module.exports = {
    data: data,
    name: 'weather',
    description: 'Get the current weather forecast for a location',
    execute: async (interaction) => {
        const location = encodeURI(interaction.options.getString('location'));
        const unit = interaction.options.getString('units')

        let symbolLetter;
        let speedUnitSystem;
        switch (unit) {
            case 'metric':
                symbolLetter = '°C';
                speedUnitSystem = 'm/s';
                break;
            case 'imperial':
                symbolLetter = '°F';
                speedUnitSystem = 'mph';
                break;
            case 'kelvin':
                symbolLetter = 'K';
                speedUnitSystem = 'K/m';
                break;
        }

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API}&units=${unit}`);
            const data = await response.json();

            const getWeatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            let weatherDescription = data.weather[0].description;
            weatherDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

            const weatherEmbed = {
                color: parseInt('17a2b8', 16),
                title: `${data.name}, ${data.sys['country']}`,
                description: `Here is the weather forecast for ${data.name}. [Full Forecast](https://openweathermap.org/city/${data.id})`,
                thumbnail: {
                    url: `${getWeatherIcon}`,
                },
                fields: [
                    {
                        name: '🔦 Current Weather',
                        value: `Feels like ${data.main.feels_like.toFixed() + symbolLetter}.\n **${weatherDescription}**`,
                        inline: true
                    },
                    {
                        name: '🌡️ Temperature',
                        value: `${data.main.temp.toFixed() + symbolLetter}`,
                        inline: true
                    },
                    {
                        name: '☁️ Cloud coverage',
                        value: `${data.clouds.all}%`,
                        inline: true
                    },
                    {
                        name: '🌬️ Wind speed',
                        value: `${data.wind.speed + speedUnitSystem}`,
                        inline: true
                    },
                    {
                        name: '🌅️ Sunrise',
                        value: `<t:${data.sys.sunrise}:t>`,
                        inline: true
                    },
                    {
                        name: '🌇 Sunset',
                        value: `<t:${data.sys.sunset}:t>`,
                        inline: true
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `${interaction.client.user.username}`,
                    icon_url: '',
                },
            };

            await interaction.reply({embeds: [weatherEmbed]});
        } catch (error) {
            console.log(error);
        }
    },
};