const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');
const momentDuration = require("moment-duration-format");
const mysql = require('mysql');

const getConnectionRunQuery = require('./getConnectionRunQuery.js');
const playingNow = require('./commands/playingnow.js');
const games = require('./commands/games.js');
const botHelp = require('./commands/bothelp.js');
const userStatus = require('./commands/users.js');
const stats = require('./commands/stats.js');
const popcornGif = require('./commands/popcornGif.js');

const authDetails = require('./auth.json');

const prefix = '$';
const adminPrefix = '-';

const bot = new Discord.Client({autoReconnect: true});

const dbConnectionPool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'bot',
  password: authDetails.dbPassword,
  database: '337bot_db'
});

//getConnectionRunQuery(dbConnectionPool);

bot.on('ready', () => {
	const botTestChannel = bot.channels.find('name', 'bottestchannel');
	botTestChannel.send('Boo Boo Bee Doo... Omnic is ready to serve its CC337 Overlords!');
	console.log(`Bot Online`);
	bot.user.setGame('$bothelp');
});

bot.on('guildMemberAdd', guildMember => {
	// Send a DM to the new user explaining our rules.
	bot.users.get(guildMember.user.id).send(
		'', {embed: {
			color: 65380,
			description: `
	${guildMember.user} welcome to ***Charlie Company 337***. We are a super casual, mostly
	Overwatch related gaming group that has a ton of fun together. We're very active here
	in Discord, have games going every night and group events throughout the month.

	__There are a few things you should do to be successful in our group:__

	1. If you haven't already, join our group on the100. This is where we schedule
		our games. You can still do PUGs in Discord, but this is the core of our group.
		https://www.the100.io/g/3140?r=205541

	2. Be sure to right-click your name in Discord and select "Change Nickname". Please
		set this to match your battlenet ID including the #1234 at the end. This allows
		game organizers to easily add you.

	3. Head over to ${bot.channels.find('name', 'introductions')} and take a moment to tell us about yourself. How
		long have you been playing OW? Who's your favorite hero? Do you play any other
		games?

	4. Check out ${bot.channels.find('name', 'use_enslaved_omnics_here')} and use the $games command to see what's on the schedule.

	5. Read ${bot.channels.find('name', 'rules-missionstatement')} to learn more.

	That's it. If you have any questions, please let a Core Member or Moderator know.
			`
		}}

	);
	const generalChannel = guildMember.guild.channels.find('name', 'general');
	const coreChannel = guildMember.guild.channels.find('name', 'core_member_chat');
	const memberLogChannel = guildMember.guild.channels.find('name', 'member_log');
	// Post a message in general/core_member_chat/member_log notifying users of new member.
	generalChannel.send(
		`
	Hey everyone! We have a new member. Please welcome ${guildMember.user} to our group!
${guildMember.user} please check your Direct Messages for an important message from the
CC337 moderators.
		`
	);
	coreChannel.send(`Hey Core Members! We have a new member. Please be sure to welcome them and encourage them to participate!
		New Member = ${guildMember.user}`
	);
	memberLogChannel.send(`New Member = ${guildMember.user}`);
});

// When a user is removed for any reason (kicked/left on own) displays a message in
// member log channel to notify mods and keep track of who has left.
bot.on('guildMemberRemove', guildMember => {
	const memberLogChannel = guildMember.guild.channels.find('name', 'member_log');
	memberLogChannel.send(`Member Left = ${guildMember.user}`);
})

// Handles commands
bot.on('message', msg => {
	// Only respond to commands that start with $ or *
	if(msg.content.startsWith(prefix) || msg.content.startsWith(adminPrefix)) {
		// $playingnow
		if(msg.content.startsWith(prefix + 'playingnow')) {
			playingNow(msg);
		}

		//$games
		else if (msg.content.startsWith(prefix + 'games')) {
			games(msg);
      getConnectionRunQuery(dbConnectionPool, 'games');
		}

		else if (msg.content.startsWith(prefix + 'test')) {
			// Use this command to test text or anything else you might need to use
			// in a a method that only responds to a specific action. For example,
			// I used it to format the text inside guildMemberAdd.
		}

		else if (
			msg.content.startsWith(prefix + 'stats') ||
			msg.content.startsWith(prefix + 'compstats') ||
			msg.content.startsWith(prefix + 'avgstats')
		) {
				// For stats commands the server needs a moment to respond to the request
				// Here we initially display some placeholder text and when the server provides
				// its response we replace it with the actual data.
				msg.reply("Working on your request.")
					.then(message => {
						const msgID = message.id;
						stats(msg, msgID);
					})
					.catch(console.error);

		}

		// $bothelp
		else if (msg.content.startsWith(prefix + 'bothelp')) {
			botHelp(msg);
		}

		else if (msg.content.startsWith(prefix + 'botstats')) {
			console.log('bot.user', bot.user);
			msg.channel.send('', {embed: {
				color: 65380,
				title: 'CC337 Bot Status',
				url: 'https://github.com/jturbo26/the100DiscordBot',
				description: 'Boop Beep, Boop Boop!',
				fields: [
					{
						name: 'Uptime',
						value: `This bot has been active for ${moment.duration(bot.uptime).format('h [hrs]:m [min]:s [sec]')}`
					},
					{
						name: 'Available Commands',
						value: '$games, $stats [battlenetID], $compstats [battlnetID], $playingnow, $popcorn, $botstats'
					}
				],
				timestamp: new Date(),
				footer: {
					text: '© Brought to you by TurboJoe & Sucrizzle'
				}
			}});
		}

		// $my100status
		else if (msg.content.startsWith(prefix + 'my100status')) {
			userStatus(msg);
		}

		// $popcorn TODO: repalce this with any gif with command $gif 'string'
		else if (msg.content.startsWith(prefix + 'popcorn')) {
			popcornGif(msg);
		}

    // $dbtest
    else if (msg.content.startsWith(prefix + 'dbtest')) {
      getConnectionRunQuery(dbConnectionPool, 'increaseCount');
    }
	}
});

// When the bot shuts down for whatever reason we post a msg in bottestchannel
// to keep a log and notify bot admins.
bot.on('disconnect', msg => {
	const botTestChannel = bot.channels.find('name', 'bottestchannel');
	botTestChannel.send('Bee Bee Boop ... Bot Disconnected');
});


// Error handling if you haven't figured that out :)
bot.on('error', e => { console.error(e); });
bot.on('warn', e => { console.warn(e); });
bot.on('debug', e => { console.info(e); });

// Discord.js command to log the bot in to discord. Uses authDetails json file
bot.login(authDetails.token);
