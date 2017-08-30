const request = require('request');
const authDetails = require('../../auth.json');
const the100UserUrl = 'https://www.the100.io/api/v1/groups/3140/users?page=all';

const my100status = (msg, userName) =>
{
    userName = userName.toLowerCase();

    const userAuthOptions =
    {
		url: the100UserUrl,
        headers:
        {
			'Authorization': authDetails.the100token
        }
    };

    const getUserStatus = (error, response, body) =>
    {
        if (!error && response.statusCode == 200)
        {
            const usersJson = JSON.parse(body);

            const requestedUser = usersJson.filter(gamer =>
            {
				return gamer.gamertag.toLowerCase() == userName;
			});

            const gamer = requestedUser[0];

            if (gamer === undefined)
            {
                msg.reply('Sorry, no user was found by that name. Please try again with a different username.');
			}
            else
            {
                msg.reply(gamer.gamertag + ' has ' + gamer.activity_score + ' activity points and ' + gamer.karmas_count + ' karma on the site!');
			}
		}
    };

	request(userAuthOptions, getUserStatus);
};

module.exports = my100status;