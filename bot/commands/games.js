const request = require('request');
const moment = require('moment');
const Discord = require('discord.js')

const messages = require('../../messages/format.js');

const authDetails = require('../../auth.json');
const the100GamesUrl = 'https://www.the100.io/api/v1/groups/3140/gaming_sessions';
const gameUrl = 'https://www.the100.io/game/';
const gamesAuthOptions =
{
    url: the100GamesUrl,
    headers:
    {
        'Authorization': authDetails.the100token
    }
};

const todaysDate = () =>
{
    var date = moment(new Date(), 'YYYY-MM-DD');

    const getDay = () =>
    {
        const day = moment().get('date');
        return day < 10 ? '0' + day : '' + day;
    };
    const getMonth = () =>
    {
        const month = moment().get('month') + 1;
        return month < 10 ? '0' + month : '' + month;
    };
    const year = moment().get('year');
    return year + '-' + getMonth() + '-' + getDay();
};

const games = msg =>
{
    const getGames = (error, response, body) =>
    {
        if (!error && response.statusCode === 200)
        {
            const gamesJson = JSON.parse(body);
            const today = todaysDate();
            const games = gamesJson.filter(game =>
            {
                const gameDate = game.start_time.split('T').shift();
                return gameDate === today;
            });
            if (games.length != 0)
            {
                games.forEach(game =>
                {
                    const gameDate = game.start_time.split('T').shift();
                    const gameTime = moment(game.start_time.split('T').pop().split('.').shift(), 'HH:mm:ss').format('h:mm A');
                    const now = moment(new Date());
                    const futureGameTime = moment(game.start_time);
                    const diff = moment(futureGameTime.diff(now, 'hours'));

                    let hoursText = ''
                    if (diff == 0)
                    {
                        hoursText = ' - In less than an hour';
                    }
                    else
                    {
                        hoursText = ' Pacific, in about ' + diff + ' hours(s)!'
                    }

                    // Create message to display depending on number of spots left
                    let suffixText = ''
                    if ((game.team_size) - (game.primary_users_count) > 0)
                    {
                        suffixText = 'Join up now while there\'s still room!'
                    }
                    else
                    {
                        suffixText = 'Might as well join as a reserve in case someone doesn\'t show!'
                    }

                    msg.channel.send('',
                    {
                        embed:
                        {
                            color: 0x00AE86,
                            fields: [
                                {
                                    name: 'Charlie Company 337 Game List',
                                    value: messages.format
                                    (
                                        "games.txt",
                                        game.creator_gamertag,
                                        game.game_name,
                                        game.category,
                                        gameDate,
                                        gameTime,
                                        hoursText,
                                        gameUrl,
                                        game.id,
                                        (game.team_size - game.primary_users_count)
                                    )
                                }
                            ]
                        }
                    });
                });
            }
            else
            {
                msg.channel.send("There are currently no games scheduled, but since you asked, that means you want to play. Go make one!! ***It's a perfect day for some mayhem!***");
            }
        }
        else
        {
            console.log("Sorry there was an error!");
        }
    };
    request(gamesAuthOptions, getGames);
};

module.exports = games;
