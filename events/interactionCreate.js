const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isCommand()) {
      return;
    }
    const leagueAPIKey = config.leagueAPIKey;
    const tftAPIKey = config.tftAPIKey;
    const { commandName, options } = interaction;
    const regex = /['"`]/g;

    if (commandName === 'lolrank') {
      let username = options.getString('summonername');
      let regionInput = options.getString('region').toLowerCase();

      username = username.replace(regex, '');
      regionInput = regionInput.replace(regex, '');

      const regionResult = getRegion(regionInput);

      if (regionResult === false) {
        const embed = new EmbedBuilder()
          .setTitle('LoL Ranks')
          .setDescription('The region does not exist.')
          .setColor('Purple');

        interaction.reply({
          embeds: [embed],
          ephemeral: false,
        });
        return;
      }

      const userUrl = `https://${regionResult}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${leagueAPIKey}`;
      const ddragonUrl =
        'https://ddragon.leagueoflegends.com/api/versions.json';

      let userData = await (await fetch(userUrl)).json();
      let dDragonVersion = await (await fetch(ddragonUrl)).json();

      const userIconUrl = `http://ddragon.leagueoflegends.com/cdn/${dDragonVersion[0]}/img/profileicon/${userData.profileIconId}.png`;
      if (userData.status && userData.status.status_code === 404) {
        const embed = new EmbedBuilder()
          .setTitle('LoL Ranks')
          .setDescription('Summoner not found.')
          .setColor('Red');

        interaction.reply({
          embeds: [embed],
          ephemeral: false,
        });
        return;
      }

      const userRank = `https://${regionResult}.api.riotgames.com/lol/league/v4/entries/by-summoner/${userData.id}?api_key=${leagueAPIKey}`;
      let userRanks = await (await fetch(userRank)).json();
      if (userRanks.length === 0) {
        const embed = new EmbedBuilder()
          .setTitle('LoL Ranks')
          .setDescription('Summoner is not ranked yet.')
          .setColor('Purple');

        interaction.reply({
          embeds: [embed],
          ephemeral: false,
        });
        return;
      }
      const embed = new EmbedBuilder()
        .setTitle('LoL Ranks ')
        .setColor('Green')
        .setDescription(
          `Name: ${userRanks[0].summonerName}
        Level: ${userData.summonerLevel}`
        )
        .setThumbnail(userIconUrl);

      let userSoloRank, userFlexRank, gamesPlayed, winrate;

      userRanks.forEach((element) => {
        if (element.queueType === 'RANKED_SOLO_5x5') {
          userSoloRank = element;
        } else if (element.queueType === 'RANKED_FLEX_SR') {
          userFlexRank = element;
        }
      });

      if (userSoloRank) {
        gamesPlayed = userSoloRank.wins + userSoloRank.losses;
        winrate = (userSoloRank.wins / gamesPlayed) * 100;
        embed.addFields({
          name: 'Solo/Duo Rank',
          value: `Rank: ${userSoloRank.tier} ${userSoloRank.rank} ${
            userSoloRank.leaguePoints
          }
            Winrate: ${winrate.toFixed(2)}%
            Games played: ${gamesPlayed}`,
          inline: true,
        });
      }
      if (userFlexRank) {
        gamesPlayed = userFlexRank.wins + userFlexRank.losses;
        winrate = (userFlexRank.wins / gamesPlayed) * 100;
        embed.addFields({
          name: 'Flex Rank',
          value: `Rank: ${userFlexRank.tier} ${userFlexRank.rank} ${
            userFlexRank.leaguePoints
          }
          Winrate: ${winrate.toFixed(2)}%
          Games played: ${gamesPlayed}`,
          inline: true,
        });
      }

      interaction.reply({
        embeds: [embed],
        ephemeral: false,
      });
    } else if (commandName === 'tftrank') {
      let username = options.getString('summonername');
      let regionInput = options.getString('region').toLowerCase();

      username = username.replace(regex, '');
      regionInput = regionInput.replace(regex, '');

      const regionResult = getRegion(regionInput);

      if (regionResult === false) {
        const embed = new EmbedBuilder()
          .setTitle('TFT Ranks')
          .setDescription('The region does not exist.')
          .setColor('Purple');

        interaction.reply({
          embeds: [embed],
          ephemeral: false,
        });
        return;
      }

      const userUrl = `https://${regionResult}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${username}?api_key=${tftAPIKey}`;
      let userData = await (await fetch(userUrl)).json();
      if (userData.status && userData.status.status_code === 404) {
        const embed = new EmbedBuilder()
          .setTitle('TFT Ranks')
          .setDescription('Summoner not found.')
          .setColor('Red');

        interaction.reply({
          embeds: [embed],
          ephemeral: false,
        });
        return;
      }

      const userRank = `https://${regionResult}.api.riotgames.com/tft/league/v1/entries/by-summoner/${userData.id}?api_key=${tftAPIKey}`;
      const ddragonUrl =
        'https://ddragon.leagueoflegends.com/api/versions.json';

      let dDragonVersion = await (await fetch(ddragonUrl)).json();

      const userIconUrl = `http://ddragon.leagueoflegends.com/cdn/${dDragonVersion[0]}/img/profileicon/${userData.profileIconId}.png`;
      let userRanks = await (await fetch(userRank)).json();
      if (userRanks.length === 0) {
        const embed = new EmbedBuilder()
          .setTitle('TFT Ranks')
          .setDescription('Summoner is not ranked yet.')
          .setColor('Purple');

        interaction.reply({
          embeds: [embed],
          ephemeral: false,
        });
        return;
      }
      const embed = new EmbedBuilder()
        .setTitle('TFT Ranks ')
        .setColor('Green')
        .setDescription(
          `Name: ${userRanks[0].summonerName}
        Level: ${userData.summonerLevel}`
        )
        .setThumbnail(userIconUrl);

      let userTFTRank, userTurboRank, gamesPlayed, winrate;

      userRanks.forEach((element) => {
        if (element.queueType === 'RANKED_TFT') {
          userTFTRank = element;
        } else if (element.queueType === 'RANKED_TFT_TURBO') {
          userTurboRank = element;
        }
      });

      if (userTFTRank) {
        gamesPlayed = userTFTRank.wins + userTFTRank.losses;
        winrate = (userTFTRank.wins / gamesPlayed) * 100;
        embed.addFields({
          name: 'TFT Rank',
          value: `Rank: ${userTFTRank.tier} ${userTFTRank.rank} ${
            userTFTRank.leaguePoints
          }
          Winrate: ${winrate.toFixed(2)}%
          Games played: ${gamesPlayed}`,
          inline: true,
        });
      }

      if (userTurboRank) {
        gamesPlayed = userTurboRank.wins + userTurboRank.losses;
        winrate = (userTurboRank.wins / gamesPlayed) * 100;
        embed.addFields({
          name: 'TFT Turbo',
          value: `Tier: ${userTurboRank.ratedTier}
          Rating: ${userTurboRank.ratedRating}
          Winrate: ${winrate.toFixed(2)}%
          Games played: ${gamesPlayed}`,
          inline: true,
        });
      }

      interaction.reply({
        embeds: [embed],
        ephemeral: false,
      });
    } else {
      interaction.reply({
        content: 'Summoner not found.',
        ephemeral: true,
      });
    }
    return;
  },
};

function getRegion(regionInput) {
  let returnRegion = false;
  const regions = {
    br: 'BR1',
    eun: 'EUN1',
    euw: 'EUW1',
    jp: 'JP1',
    kr: 'KR',
    lan: 'LA1',
    las: 'LA2',
    na: 'NA1',
    oc: 'OC1',
    ru: 'RU',
    tr: 'TR1',
  };

  for (const region in regions) {
    if (region == regionInput) {
      returnRegion = regions[region];
    }
  }

  return returnRegion;
}
