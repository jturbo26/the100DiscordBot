const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');

const playingNow = require('./commands/playingnow.js');
const games = require('./commands/games.js');
const botHelp = require('./commands/bothelp.js');
const userStatus = require('./commands/users.js');
const stats = require('./commands/stats.js');

const authDetails = require('./auth.json');

const prefix = '$';
const adminPrefix = '*';

const bot = new Discord.Client({autoReconnect: true});

bot.on('ready', () => {
	const botTestChannel = bot.channels.find('name', 'use_enslaved_omnics_here');
	botTestChannel.sendMessage('Boo Boo Bee Doo... Omnic is ready to serve its CC337 Overlords!');
	console.log(`Bot Online`);
	bot.user.setGame('$bothelp');
});

bot.on('guildMemberAdd', (guildMember) => {
	const generalChannel = guildMember.guild.channels.find('name', 'general');
	const coreChannel = guildMember.guild.channels.find('name', 'core_member_chat');
	generalChannel.sendMessage('Hey '+ guildMember.user + '!! Great to have you! A few things you should do now:\n' +
		'```1. Please be sure your Discord nickname match your Battlenet id, including the #1234 at the end.\n' +
		'2. Head over to #introductions and inroduce yourself. Who are you? What games do you play? Who\'s your fav OW Hero?\n' +
		'3. Stop by the #use_enslaved_omnics_here channel to see if we have any games scheduled using the command $games\n' +
		'4. Sign up for some games on the100.io or start a PUG with people here in Discord\n' +
		'5. Follow the #rules, and enjoy our little gaming community!```\n' +
		'If you have any questions, reach out to an @moderator or @CC337_Core_Member and we\'re happy to help!'
	);
	coreChannel.sendMessage('Hey Core Members! We have a new member. Please be sure to welcome them and encourage them to participate!\n' +
		'\nNew Member= ' + guildMember.user
		);
});

bot.on('message', msg => {

	if(msg.content.startsWith('$') || msg.content.startsWith('*')) {
		//$playingnow
		if(msg.content.startsWith(prefix + 'playingnow')) {
			playingNow(msg);
		}

		//$games
		else if (msg.content.startsWith(prefix + 'games')) {
			games(msg);
		}

		else if (
			msg.content.startsWith(prefix + 'stats') ||
			msg.content.startsWith(prefix + 'compstats') ||
			msg.content.startsWith(prefix + 'avgstats')
		) {
				stats(msg);
		}

		//$bothelp
		else if(msg.content.startsWith(prefix + 'bothelp')) {
			botHelp(msg);
		}

		//$my100status
		else if (msg.content.startsWith(prefix + 'my100status')) {
			userStatus(msg);
		}

		else if (msg.content.startsWith(adminPrefix + 'shutdown')) {
			const botTestChannel = bot.channels.find('name', 'bottestchannel');
			bot.user.setGame('Offline');
			botTestChannel.sendMessage('Shutting Down');
			bot.destroy();
		}
	}
});

bot.on('disconnect', msg => {
	const botTestChannel = bot.channels.find('name', 'use_enslaved_omnics_here');
	botTestChannel.sendMessage('Bee Bee Boop ... Bot Disconnected');
});

bot.on('error', e => { console.error(e); });
bot.on('warn', e => { console.warn(e); });
bot.on('debug', e => { console.info(e); });

bot.login(authDetails.token);
