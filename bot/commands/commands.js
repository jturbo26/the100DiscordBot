const messages = require('../../messages/format.js');

const commands = (msg) =>
{
	msg.channel.send('',
    {
        embed:
        {
            color: 65380,
            fields: [
                {
                    name: 'The CC337 Bot\'s Command List',
                    value: messages.format
                    (
                        "commands.txt"
                    )
                }
            ]
        }
    });
};

module.exports = commands;