const request = require('request');
const moment = require('moment');
const Discord = require('discord.js')

const authDetails = require('../auth.json');
const the100GamesUrl = 'https://www.the100.io/api/v1/groups/3140/gaming_sessions';
const gameUrl = 'https://www.the100.io/game/';
const gamesAuthOptions = {
	url: the100GamesUrl,
	headers: {
		'Authorization': authDetails.the100token
	}
};

const todaysDate = () => {
	var date = moment(new Date(), 'YYYY-MM-DD');

	const getDay = () => {
		const day = moment().get('date');
		return day < 10 ? '0' + day : '' + day;
	};
	const getMonth = () => {
		const month = moment().get('month') + 1;
		return month < 10 ? '0' + month : '' + month;
	};
	const year = moment().get('year');
	return year + '-' + getMonth() + '-' + getDay();
};

const games = msg => {
	console.log('$games was called');
	const getGames = (error, response, body) => {
		if (!error && response.statusCode === 200) {
			const gamesJson = JSON.parse(body);
			const today = todaysDate();
			const games = gamesJson.filter(game => {
				const gameDate = game.start_time.split('T').shift();
				return gameDate === today;
			});
			if(games.length != 0) {
				games.forEach(game => {
					const gameDate = game.start_time.split('T').shift();
					const gameTime = moment(game.start_time.split('T').pop().split('.').shift(), 'HH:mm:ss').format('h:mm A');
					const now = moment(new Date());
					const futureGameTime = moment(game.start_time);
					const diff = moment(futureGameTime.diff(now, 'hours'));

					let hoursText = ''
					if (diff == 0) {
						hoursText = ' - In less than an hour';
					}
					else {
						hoursText = ' Pacific, in about ' + diff + ' hours(s)!'
					}

					// Create message to display depending on number of spots left
					let suffixText = ''
					if ((game.team_size) - (game.primary_users_count) > 0){
						suffixText = 'Join up now while there\'s still room!'
					}
					else {
						suffixText = 'Might as well join as a reserve in case someone doesn\'t show!'
					}

          // Create the embed for the game response
					const embed = new Discord.RichEmbed()
					  .setColor(0x00AE86)
						.setAuthor(game.creator_gamertag + '\'s ' + game.game_name + ' Game')
					  .setTimestamp()
					  .setURL()
					  .setFooter('© Brought to you by TurboJoe & Sucrizzle')
						.addField('__Game Info__',(
							'**Game Type:** ' + game.category
							+ '\n**Date:** ' + gameDate
							+ '\n**Time:** ' + gameTime + hoursText
							+ '\n**URL:** ' + gameUrl + game.id
						))
						.addField('__Description__', game.name
						  + '\n\nThere are currently ' + '**' +((game.team_size)- (game.primary_users_count)) + '**' + ' spots available.  ' + suffixText
						  + '\n\nFor help converting to your local time: <http://www.worldtimebuddy.com/>')

				 		msg.channel.send({ embed });

				});
			}
			else {
				msg.channel.send("There are currently no games scheduled, but since you asked, that means you want to play. Go make one!! ***It's a perfect day for some mayhem!***");
			}
		}
		else {
			console.log("Sorry there was an error!");
		}
	};
	request(gamesAuthOptions, getGames);
};

module.exports = games;
