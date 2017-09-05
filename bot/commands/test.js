const messages = require('../../messages/format.js');

const test = (bot, msg) =>
{
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // January is 0
    const yyyy = today.getFullYear();

    if (dd < 10)
    {
        dd = '0' + dd
    }

    if (mm < 10)
    {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    msg.reply(messages.format('test.txt', today));
}

module.exports = test;