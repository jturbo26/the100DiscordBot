const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');

const bot = new Discord.Client({autoReconnect: true});

const AuthDetails = require('./auth.json');
const the100token = require('./auth.json');
const botChannel = '206052775061094401';
const genChannel = '193349994617634816';
const the100StatusUrl = 'http://the100.io/api/v1/groups/3140/statuses';
const the100UserUrl = 'https://www.the100.io/api/v1/groups/3140/users/';
const the100GamesUrl = 'https://www.the100.io/api/v1/groups/3140/gaming_sessions';
const gameUrl = 'https://www.the100.io/game/';
const statusAuthOptions = {
  url: the100StatusUrl,
  headers: {
    'Authorization': the100token.the100token
  }
};
const prefix = '$';
const adminPrefix = '*';

const botResponses = {
  isPlaying: ' is playing right now!',
  says: ' here is what they say. ',
  willSherpa: ' and #willSherpa!',
  joinMe: ' and wants you to join them!',
  inviteMe: ' and wants to be invited to your group!',
  nobodyPlaying: 'Sorry! Nobody has indicated they are willing to join a group right now. :( ',
  signup: 'You can be the first though! Head over to the100.io and set your status so others know you want to group up!'
};

const botHelp = {
  things: 'Here are the things you can do with this bot: \n',
  playingNow: '\n $playingnow will show you everyone who wants to group up from the100.io. If nobody shows up, be sure to set your status on the site.',
  games: '\n $games will display a list of games that are going on today along with a little information'
};

const todaysDate = () => {
  const date = new Date();
  const day = date.getDate();
  const getMonth = () => {
    const month = date.getMonth()+1;
    return month < 10 ? '0' + month : '' + month;
  };
  const month = date.getMonth()+1 < 10 ? '0' + month : '' + month;
  const year = date.getFullYear();
  return year + '-' + getMonth() + '-' + day;
};

bot.on('ready', () => {
	console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
  bot.sendMessage(botChannel, 'The100bot is online and ready to go!');
  bot.setStatus('online', '$botHelp');
});

bot.on('serverNewMember', (server, user) => {
  console.log("new member=", user);
  bot.sendMessage(genChannel, 'Welcome ' + user + '!' +
  ' Please be sure your Discord nickname matches your Battlenet ID. We look forward to seeing you in game!' +
  "\n Once your membership if verified by a mod, you will receive your Discord role promotion to 'Member'.");
});

bot.on('message', msg => {
  if(!msg.content.startsWith(prefix)) return;

  //$playingnow
  if(msg.content.startsWith(prefix + 'playingnow')) {
    console.log(msg.content, " message was used");
    const getGroupStatuses = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);
        if(info.length > 0) {
          info.forEach(userGamerInfo => {
            if(userGamerInfo.category === '#willsherpa') {
              bot.reply(msg, userGamerInfo.gamertag + botResponses.isPlaying +
              botResponses.willSherpa);
            }
            else if(userGamerInfo.category === '#joinme') {
              bot.reply(msg, userGamerInfo.gamertag + botResponses.isPlaying +
              botResponses.joinMe);
            }
            else {
              bot.reply(msg, userGamerInfo.gamertag + botResponses.isPlaying +
              botResponses.inviteMe);
            }
          });
        }
        else {
          bot.reply(msg, botResponses.nobodyPlaying + botResponses.signup);
        }
      }
    };
    request(statusAuthOptions, getGroupStatuses);
  }

  //bothelp
  else if(msg.content.startsWith(prefix + 'bothelp')) {
    console.log(msg.content, " message was used");
    bot.reply(msg, botHelp.things + botHelp.playingNow + botHelp.games);
  }

  else if (msg.content.startsWith(prefix + 'my100status')) {
    const userName = msg.content.split(' ').pop();
    const userAuthOptions = {
      url: the100UserUrl,
      headers: {
        'Authorization': the100token.the100token
      }
    };
    const getUserStatus = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const usersJson = JSON.parse(body);
        const requestedUser = usersJson.filter(gamer => {
          return gamer.gamertag == 'Wannahotchic';
        });
        console.log(requestedUser[0], requestedUser[0].gamertag, requestedUser[0].activity_score);
      }
      else {
        console.log("Sorry there was an error!");
      }
    };
    request(userAuthOptions, getUserStatus);
  }

  else if (msg.content.startsWith(prefix + 'games')) {
    const gamesAuthOptions = {
      url: the100GamesUrl,
      headers: {
        'Authorization': the100token.the100token
      }
    };
    const getGames = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const gamesJson = JSON.parse(body);
        const today = todaysDate();
        const games = gamesJson.filter(game => {
          const gameTime = game.start_time.split('T').shift();
          return gameTime === today;
        });
        games.forEach(game => {
          //const momentTime = moment(game.start_date, 'YYYY-MM-DD hh:mm:ss a');
          //bot.sendMessage(msg.channel, momentTime);
          const gameTime = game.start_time.split('T').shift();
          bot.sendMessage(msg.channel, '```Game Creator: ' + game.creator_gamertag +
          '\nGame Type: ' + game.category +
          '\nDate: ' + gameTime +
          '\nThere are currently ' + ((game.team_size)-(game.primary_users_count)) + ' spots available' + ' ```' +
          'Game Url: ' + '<' + gameUrl+game.id + '>' + '\n\n');
        });
        //bot.reply(msg, 'There are ' + numberOfGames + ' scheduled right now. Here you go:\n');
      }
      else {
        console.log("Sorry there was an error!");
      }
    };
    request(gamesAuthOptions, getGames);
  }
  //shutdown
  else if (msg.content.startsWith(adminPrefix + 'shutdown')) {
    console.log(msg.content, " message was used");
    bot.setStatus('offline', '$botHelp');
    bot.logout();
  }

});


bot.loginWithToken(AuthDetails.token);
