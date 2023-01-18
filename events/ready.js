const {
  Discord,
  ActivityType,
  ApplicationCommandOptionType,
} = require('discord.js');
const config = require('./../config.json');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in`);

    client.user.setActivity('slash commands avaible now!', {
      type: ActivityType.Playing,
    });

    let myCommands;
    myCommands = client.application.commands; //global slash commands
    //myCommands = client.guilds.cache.get('919974664174989362').commands; //For testing

    myCommands.create({
      name: 'lolrank',
      description: 'Gets your League of Legends Rank',
      options: [
        {
          name: 'summonername',
          description: 'Your Ingame name',
          required: true,
          type: ApplicationCommandOptionType.String,
          maxLength: 16,
        },
        {
          name: 'region',
          description: 'Your Region',
          required: true,
          type: ApplicationCommandOptionType.String,
          maxLength: 16,
        },
      ],
    });

    myCommands.create({
      name: 'tftrank',
      description: 'Gets your Teamfight Tactics Rank',
      options: [
        {
          name: 'summonername',
          description: 'Your Ingame name',
          required: true,
          type: ApplicationCommandOptionType.String,
          maxLength: 16,
        },
        {
          name: 'region',
          description: 'Your Region',
          required: true,
          type: ApplicationCommandOptionType.String,
          maxLength: 16,
        },
      ],
    });
  },
};
