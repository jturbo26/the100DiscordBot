const Discord = require('discord.js');
const request = require('request');
const authDetails = require('./auth.json');
const bot = new Discord.Client({ autoReconnect: true });
const commands = require('./bot/commands.js');
const inviteAgeDays = 7;
const inviteMaxUses = 1;
const inviteUnique = true;


bot.on('ready', () =>
{
    const botTestChannel = bot.channels.find('name', 'bottestchannel');
    const welcomeChannel = bot.channels.find('name', 'welcome_new_members');
    const rulesChannel = bot.channels.find('name', 'rules_and_info');

    botTestChannel.send('Boo Boo Bee Doo... Omnic is ready to serve its CC337 Overlords!');

    console.log('Bot Online');

    bot.user.setGame('$help');

    // Tries to perform this function on the live server
    try
    {
        // Get a list of members with Newbie role
        
        // CC337 Server
        bot.guilds.get('193349994617634816').roles.find('name', 'Newbie').members.forEach((member) =>
        {

            // Get today's date
            const todaysDate = new Date();

            // Find member's join date
            const joinDate = member.joinedAt;

            // Add three days to member's join date
            const threeDaysAfterJoinDate = joinDate.setDate(joinDate.getDate() + 3);

            // If member has been here more than three days and is not a Grunt yet, kick 'em out
            // and send them a message why
            if (threeDaysAfterJoinDate < todaysDate && member.roles.exists('name', 'Grunt') === false)
            {
                // Generate a unique, single use, 7 day invite for the member and send them a DM
                welcomeChannel.createInvite({maxAge: 604800, maxUses: 1, unique: true})
                .then(invite => bot.users.get(member.user.id).send('',
                {
                    embed:
                    {
                        color: 65380,
                        description: `Hello, you’ve been removed from the ***Charlie Company 337*** Discord for not completing basic membership requirements after three days.

Feel free to rejoin and follow these instructions to access the rest of the Discord:

__**To Gain Full Access to the CC337 Discord:**__

 **1**) Rejoin Discord: https://discord.gg/${invite.code}  This invite is single-use only and will expire after 7 days

 **2**) Change your nickname on Discord to your Bungie ID, Steam ID or Battlenet Tag. See how to here: https://support.discordapp.com/hc/en-us/articles/219070107-Server-Nicknames

 **3**) Join our group on the100: https://www.the100.io/groups/3140

Once you've completed this, post in the #welcome_new_members channel to be promoted to Grunt and receive access to the rest of the Discord.`
                    }
                }))
                .then(() =>
                {
                    member.kick('Did not complete basic membership requirements after three days');
                });
        }
    })
        console.log('Live Server');
    }
    catch (error)
    {
        console.log('Non Live Server');
    }
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
            description: `Welcome to ***Charlie Company 337***! We are a casual gaming group that has a ton of fun together. We're very active here in Discord, have games going every night and group events throughout the month.

__**There are a few things you need to do to gain full access to the Discord:**__

     **1**) Join our group on the100.io. This is where we schedule our games. You can still LFG in Discord, but this is the core of our group. https://www.the100.io/g/3140

     **2**) Be sure to set your nickname to let people know how to find you on your main platform (e.g. "Username#1234 (Bungie)" or "Username (Steam)").  
     
     To do this:
     - right click your name in Discord
     - select "Edit Server Profile"
     - change your nickname in the text box 
     - click "Save Changes" at the bottom of the screen.  

     See here for more info: https://support.discordapp.com/hc/en-us/articles/219070107-Server-Nicknames

     **3**) Familiarize yourself with our ${bot.channels.find('name', 'rules_and_info')}.

     **4**) Once you've done everything above, post in ${bot.channels.find('name', 'welcome_new_members')} to get promoted to Grunt and have full acess to our Discord.

That's it! If you have any questions, please let a member of the leadership team know or post in ${bot.channels.find('name', 'welcome_new_members')} for help.`
        }
    });

    // Add Newbie role to new member upon joining
    guildMember.addRole(guildMember.guild.roles.find('name', 'Newbie'));

    const leadershipChannel = guildMember.guild.channels.find('name', 'company_leadership');
    const welcomeChannel = bot.channels.find('name', 'welcome_new_members');
    const memberLogChannel = guildMember.guild.channels.find('name', 'member_log');

    // Post a message in welcome_new_members/company_leadership/member_log notifying users of new member.
    welcomeChannel.send(`Hey everyone! We have a new member. Please welcome ${guildMember.user} to our group! ${guildMember.user}, please read the post at the top of this channel for more information on how to get promoted to Grunt and be given access to the rest of the Discord. Happy gaming!`);

    leadershipChannel.send(`Hey leadership team! We have a new member. Please be sure to welcome them and encourage them to participate! New Member = ${guildMember.user}`);

    memberLogChannel.send(`New Member = ${guildMember.user}`);
});

// When a user is removed for any reason (kicked/left on own) displays a message in
// member log channel to notify mods and keep track of who has left.
bot.on('guildMemberRemove', (guildMember) =>
{
    const memberLogChannel = guildMember.guild.channels.find('name', 'member_log');

    // Check audit logs to see if member was kicked
    guildMember.guild.fetchAuditLogs('limit',1)
    .then((logs) => {

        // If member was kicked by CC337Bot, send this message
        if(logs.entries.first().action === 'MEMBER_KICK' && logs.entries.first().executor.id === '206128006698237952') {
            memberLogChannel.send(`Newbie ${guildMember.user} has been kicked! Good riddance!`);
        }

        // If member was banned, left, or kicked by someone else, send this message
        else {
            memberLogChannel.send(`Member Left = ${guildMember.user}`);
        }
    });


})

// When a member is promoted to grunt or trooper, post a message in general
// When a newbie changes their nickname send a notification to leadership
// When any member changes their nickname, add it to the mod log
bot.on('guildMemberUpdate', (oldMember,newMember) =>
{
    const generalChannel = newMember.guild.channels.find('name', 'general');
    const leadershipChannel = newMember.guild.channels.find('name', 'company_leadership');
    const memberLogChannel = newMember.guild.channels.find('name', 'member_log')

    // If roles have been updated
    if(oldMember.roles.equals(newMember.roles) === false) {

        // If the new role added is grunt, send message to general channel
        if(oldMember.roles.exists('name','Grunt') === false && newMember.roles.exists('name','Grunt')) {
            generalChannel.send(`Please welcome our newest grunt ${newMember.user}! Take a moment to introduce yourself in ${newMember.guild.channels.find('name', 'introductions')} and pick up some roles in ${newMember.guild.channels.find('name', 'role_requests')}. We're glad you joined us!`);
        }

        // If the new role added is trooper, send a message to general channel
        else if (oldMember.roles.exists('name','Trooper') === false && newMember.roles.exists('name','Trooper')) {
            generalChannel.send(`Congrats to ${newMember.user} on making Trooper status! Thanks for playing with us! ${newMember.guild.emojis.find('name','dorito')}`);
        }
    }

    // If a newbie has changed their nickname
    if(newMember.nickname && oldMember.nickname !== newMember.nickname) {
        
        // Post a message to member_log
        if (oldMember.nickname) {
            memberLogChannel.send(`${oldMember.nickname} has changed their nickname to ${newMember.user}`);
        }
        
        else{
            memberLogChannel.send(`${oldMember.displayName} has added the nickname ${newMember.user}`);
        }
        
        if(newMember.roles.exists('name','Newbie'))
        {
            if (oldMember.nickname) {
                leadershipChannel.send(`Newbie ${oldMember.nickname} has changed their nickname to ${newMember.user}`);
            }
            
            else{
                leadershipChannel.send(`Newbie ${oldMember.displayName} has added the nickname ${newMember.user}`);
            }
        }
    }

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