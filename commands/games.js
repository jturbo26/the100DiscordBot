const request = require('request');
const moment = require('moment');

const authDetails = require('../auth.json');
const the100GamesUrl = 'https://www.the100.io/api/v1/groups/3140/gaming_sessions';
const gameUrl = 'https://www.the100.io/game/';
const gamesAuthOptions = {
  url: the100GamesUrl,
  headers: {
    'Authorization': authDetails.the100token
  }
};

const todaysDate = () => {
  const date = new Date();
  const getDay = () => {
    const day = date.getDate();
    return day < 10 ? '0' + day : '' + day;
  };
  const getMonth = () => {
    const month = date.getMonth()+1;
    return month < 10 ? '0' + month : '' + month;
  };
  const year = date.getFullYear();
  return year + '-' + getMonth() + '-' + getDay();
};

const games = (msg, bot) => {
  console.log('$games was called');
  const getGames = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const gamesJson = JSON.parse(body);
      const today = todaysDate();
      const games = gamesJson.filter(game => {
        const gameDate = game.start_time.split('T').shift();
        return gameDate === today;
      });
      games.forEach(game => {
        const gameDate = game.start_time.split('T').shift();
        const gameTime24 = game.start_time.split('T').pop().split('.').shift();
        const gameTime12 = moment(gameTime24);
        const momentFinalTime = gameTime12.format('hh:mm:ss');
        bot.sendMessage(msg.channel, '```Game Creator: ' + game.creator_gamertag +
        '\nGame Type: ' + game.category +
        '\nDate: ' + gameDate +
        '\nTime: ' + gameTime24 + ' Pacific' +
        '\nThere are currently ' + ((game.team_size)-(game.primary_users_count)) + ' spots available' + ' ```' +
        'Game Url: ' + '<' + gameUrl+game.id + '>' + '\n\n');
      });
    }
    else {
      console.log("Sorry there was an error!");
    }
  };
  request(gamesAuthOptions, getGames);
};

module.exports = games;
