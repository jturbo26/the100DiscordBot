const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');

const playingNow = require('./commands/playingnow.js');
const games = require('./commands/games.js');
const botHelp = require('./commands/bothelp.js');
const userStatus= require('./commands/users.js');

const authDetails = require('./auth.json');
const botChannel = '206052775061094401';
const genChannel = '193349994617634816';

const prefix = '$';
const adminPrefix = '*';

const bot = new Discord.Client({autoReconnect: true});

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
    playingNow(msg, bot);
  }

	//$games
  else if (msg.content.startsWith(prefix + 'games')) {
    games(msg, bot);
  }

  //$bothelp
  else if(msg.content.startsWith(prefix + 'bothelp')) {
    botHelp(msg, bot);
  }

	//$my100status
  else if (msg.content.startsWith(prefix + 'my100status')) {
  	userStatus(msg, bot);
  }

  //shutdown
  else if (msg.content.startsWith(adminPrefix + 'shutdown')) {
    console.log(msg.content, " message was used");
    bot.setStatus('offline', '$botHelp');
    bot.logout();
  }
});

bot.on('error', e => { console.error(e); });
bot.on('warn', e => { console.warn(e); });
bot.on('debug', e => { console.info(e); });

bot.loginWithToken(authDetails.token);
