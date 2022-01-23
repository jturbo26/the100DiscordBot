// Commands
const commands = require('./commands/commands.js');
const help = require('./commands/help.js');
const popcorn = require('./commands/popcorn.js');
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

                        case (parameters[0] === 'help'):

                            help(msg, userPrefix + parameters[0], 'Provides useful information on how to properly use a given command', '[Command]', '[Command] The command you would like to get help with.');

                            break;

                        case (parameters[0] === 'popcorn'):

                            help(msg, userPrefix + parameters[0], 'Displays a random popcorn image.');

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

        case (command === userPrefix + 'popcorn'): // $popcorn

            // $popcorn TODO: repalce this with any gif with command $gif 'string'

            popcorn(msg);

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
