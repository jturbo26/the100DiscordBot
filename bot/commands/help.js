const moment = require('moment');
const momentDuration = require('moment-duration-format');

const help = (msg, command, description, usage, parameters) =>
{
    if (!(usage === undefined) || !(parameters === undefined))
    {
        msg.channel.send('',
        {
            embed:
            {
                color: 65380,
                fields: [
                    {
                        name: 'Command',
                        value: '```apache\n' + command + ' ' + usage + '```'
                    },
                    {
                        name: 'Parameters',
                        value: '```apache\n' + parameters + '```'
                    },
                    {
                        name: 'Description',
                        value: '```yaml\n' + description + '```'
                    }
                ]
            }
        });
    }
    else
    {
        msg.channel.send('',
        {
            embed:
            {
                color: 65380,
                fields: [
                    {
                        name: 'Command',
                        value: '```apache\n' + command + '```'
                    },
                    {
                        name: 'Description',
                        value: '```yaml\n' + description + '```'
                    }
                ]
            }
        });
    }
    
};

module.exports = help;