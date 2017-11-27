// Commands
const commands = require('./commands/commands.js');
const games = require('./commands/games.js');
const help = require('./commands/help.js');
const my100status = require('./commands/my100status.js');
const playingnow = require('./commands/playingnow.js');
const popcorn = require('./commands/popcorn.js');
const stats = require('./commands/stats.js');
const test = require('./commands/test.js');

// Command Prefixes
const userPrefix = '$';

const testbotjoe26Tag = 'testbotjoe26#8213';

const execute = (bot, msg, command, parameters) =>
{
    switch (true)
    {
        case (command === userPrefix + 'commands'): // $commands

            commands(msg);

            break;

        case (command === userPrefix + 'games'): // $games

            games(msg);

            break;

        case (command === userPrefix + 'help'): // $help

            if (parameters[0] !== undefined)
            {
                parameters[0] = parameters[0].replace(/\$/g, '');
            }

            switch (parameters.length)
            {
                case 0:

                    help(msg, userPrefix + 'help', 'Provides useful information on how to properly use a given command', '[command]', '[command] The command you would like to get help with');

                    break;

                case 1:

                    switch (true)
                    {
                        case (parameters[0] === 'commands'):

                            help(msg, userPrefix + parameters[0], 'Lists all available CC337 Bot commands.');

                            break;

                        case (parameters[0] === 'games'):

                            help(msg, userPrefix + parameters[0], 'Displays a list of games available for the rest of the day.');

                            break;

                        case (parameters[0] === 'help'):

                            help(msg, userPrefix + parameters[0], 'Provides useful information on how to properly use a given command', '[Command]', '[Command] The command you would like to get help with.');

                            break;

                        case ((parameters[0] === ('my100status')) || (parameters[0] === ('my100stats'))):

                            help(msg, userPrefix + parameters[0], 'Shows you a user\'s activity points and karma from the100.io site.', '[BattleTag]', '[BattleTag] The Battle.net Tag of the user you would like to lookup.');

                            break;

                        case (parameters[0] === 'playingnow'):

                            help(msg, userPrefix + parameters[0], 'Show you everyone who wants to group up from the100.io.\n\nDon\'t forget to set your status on the site!');

                            break;

                        case (parameters[0] === 'popcorn'):

                            help(msg, userPrefix + parameters[0], 'Displays a random popcorn image.');

                            break;

                        case (parameters[0] === 'stats'):

                            // TODO: Create multigame lookup
                            // Example: $stats overwatch [BattleTag] or $stats ow [BattleTag]

                            help(msg, userPrefix + parameters[0], 'Shows you a user\'s Overwatch statistics.', '[Mode] [BattleTag]', '[Mode] Can either be QuickPlay (QP) or Competitive (Comp)\n\n[BattleTag] The Battle.net Tag of the user you would like to lookup.');

                            break;

                        case (parameters[0] === 'test'):

                            if (bot.user.tag === testbotjoe26Tag)
                            {
                                help(msg, userPrefix + parameters[0], 'Runs "test" code via the $test command.');
                            }

                            break;

                        default: // Command not found

                            msg.channel.send('', {
                                embed: {
                                    color: 0xFF0000,
                                    fields: [
                                        {
                                            name: parameters[0] + ' not found',
                                            value: '```yaml\n' + `Type $commands to display a list of available commands` + '```'
                                        }
                                    ]
                                }
                            });
                    }

                    break;
            }

            break;

        case ((command === userPrefix + 'my100status') || (command === userPrefix + 'my100stats')): // $my100stats or $my100status

            // TODO: When a user issues the command with no parameter, reference there own BattleTag if in database.

            switch (parameters.length)
            {
                case 0:

                    help(msg, command, 'Shows you a user\'s activity points and karma from the100.io site.', '[BattleTag]', '[BattleTag] The Battle.net Tag of the user you would like to lookup.');

                    break;

                case 1:

                    my100status(msg, parameters[0]);

                    break;

                default:

                    help(msg, command, 'Shows you a user\'s activity points and karma from the100.io site.', '[BattleTag]', '[BattleTag] The Battle.net Tag of the user you would like to lookup.');
            }

            break;

        case (command === userPrefix + 'playingnow'): // $playingnow

            playingnow(msg);

            break;

        case (command === userPrefix + 'popcorn'): // $popcorn

            // $popcorn TODO: repalce this with any gif with command $gif 'string'

            popcorn(msg);

            break;

        case (command === userPrefix + 'stats'): // $stats

            // For stats commands the server needs a moment to respond to the request
            // Here we initially display some placeholder text and when the server provides
            // its response we replace it with the actual data.

            // TODO: When a user issues the command with no parameter, reference there own BattleTag if in database.

            switch (parameters.length)
            {
                case 0:

                    help(msg, command, 'Shows you a user\'s Overwatch quick play statistics.', '[BattleTag]', '[BattleTag] The Battle.net Tag of the user you would like to lookup.');

                    break;

                case 1:

                    msg.reply('Working on your request.')
                        .then(message =>
                        {
                            const msgID = message.id;
                            stats(msg, msgID, parameters[0]);
                        })
                        .catch(console.error);

                    break;

                case 2:

                    msg.reply('Working on your request.')
                        .then(message =>
                        {
                            const msgID = message.id;
                            stats(msg, msgID, parameters[1], parameters[0]);
                        })
                        .catch(console.error);

                    break;

                default:

                    help(msg, command, 'Shows you a user\'s Overwatch quick play statistics.', '[BattleTag]', '[BattleTag] The Battle.net Tag of the user you would like to lookup.');
            }

            break;

        case (command === userPrefix + 'test'): // $test

            // Use this command to execute some code via the "test" command on the test server

            if (bot.user.tag == testbotjoe26Tag)
            {
                test(bot, msg);
            }

            break;

        default: // Command not found

            // Check to see if the user was trying to type a dollar value or utilize multiple $$$ symbols rather than issue a command
            if ((isNaN(parseInt(command.substr(1, 1)))) && (command.substr(1,1) !== '$'))
            {
                msg.channel.send('',
                {
                    embed:
                    {
                        color: 0xFF0000,
                        fields:
                        [
                            {
                                name: command + ' not found',
                                value: '```yaml\n' + `Type $commands to display a list of available commands` + '```'
                            }
                        ]
                    }
                });
            }
    }
};

const process = (bot, msg) =>
{
    if (msg.content.startsWith(userPrefix))
    {
        var data;

        var command;

        var parameters;

        data = msg.content.match(/(['"])((?:\\\1|.)+?)\1|([^\s"']+)/g);

        command = data[0];

        command = command.toLowerCase();

        data.splice(0, 1);

        parameters = data;

        execute(bot, msg, command, parameters);
    }
};

module.exports.process = process;
