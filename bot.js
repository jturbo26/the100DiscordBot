const Discord = require('discord.js');
const request = require('request');
const authDetails = require('./auth.json');
const bot = new Discord.Client({ autoReconnect: true });
const commands = require('./bot/commands.js');

bot.on('ready', () =>
{
    const botTestChannel = bot.channels.find('name', 'bottestchannel');

    botTestChannel.send('Boo Boo Bee Doo... Omnic is ready to serve its CC337 Overlords!');

    console.log(`Bot Online`);

    bot.user.setGame('$help');
});

// Handles commands
bot.on('message', (msg) =>
{
    commands.process(bot, msg);
});

bot.on('guildMemberAdd', (guildMember) =>
{
    // Send a DM to the new user explaining our rules.
    bot.users.get(guildMember.user.id).send('',
    {
        embed:
        {
            color: 65380,
            description: `
        ${guildMember.user} Welcome to ***Charlie Company 337***. We are a super casual
        gaming group that has a ton of fun together. We're very active here
        in Discord, have games going every night and group events throughout the month.

        __There are a few things you should do to be successful in our group:__

        1. If you haven't already, join our group on the100. This is where we schedule
	        our games. You can still do PUGs in Discord, but this is the core of our group.
	        https://www.the100.io/g/3140

        2. Be sure to right-click your name in Discord and select "Change Nickname". If
	        your main game is a blizzard game use your BattlenetId. If it's a Steam game like
	        PUBG please change your nickname to match your Steam name and format like this: "Username (Steam)"

        3. Head over to ${bot.channels.find('name', 'introductions')} and take a moment to tell us about yourself. What
	        games do you play? What else do you like to do? Feel free to just say hi. We're a welcoming group.

        4. Check out ${bot.channels.find('name', 'use_enslaved_omnics_here')} and use the $games command to see what's on the schedule.

        5. Read ${bot.channels.find('name', 'rules-missionstatement')} to learn more.

        That's it. If you have any questions, please let a Core Member or Moderator know.
		        `
        }
    });

    const generalChannel = guildMember.guild.channels.find('name', 'general');

    const coreChannel = guildMember.guild.channels.find('name', 'core_member_chat');

    const memberLogChannel = guildMember.guild.channels.find('name', 'member_log');

    // Post a message in general/core_member_chat/member_log notifying users of new member.
    generalChannel.send(`Hey everyone! We have a new member. Please welcome ${guildMember.user} to our group! ${guildMember.user} please check your Direct Messages for an important message from the CC337 moderators.`);

    coreChannel.send(`Hey Core Members! We have a new member. Please be sure to welcome them and encourage them to participate! New Member = ${guildMember.user}`);

    memberLogChannel.send(`New Member = ${guildMember.user}`);
});

// When a user is removed for any reason (kicked/left on own) displays a message in
// member log channel to notify mods and keep track of who has left.
bot.on('guildMemberRemove', (guildMember) =>
{
    const memberLogChannel = guildMember.guild.channels.find('name', 'member_log');

    memberLogChannel.send(`Member Left = ${guildMember.user}`);
})

// When the bot shuts down for whatever reason we post a msg in bottestchannel
// to keep a log and notify bot admins.
bot.on('disconnect', (msg) =>
{
    const botTestChannel = bot.channels.find('name', 'bottestchannel');

    botTestChannel.send('Bee Bee Boop ... Bot Disconnected');
});

// Debug Handler
bot.on('debug', (e) =>
{
    console.info(e);
});

// Warning Handler
bot.on('warn', (e) =>
{
    console.warn(e);
});

// Error Handler
bot.on('error', (e) =>
{
    console.error(e);
});

// Discord.js command to log the bot in to discord. Uses authDetails json file
bot.login(authDetails.token);
