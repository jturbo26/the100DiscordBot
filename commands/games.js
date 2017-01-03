const request = require('request');
const moment = require('moment');

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
		const month = moment().get('month')+1;
		return month < 10 ? '0' + month : '' + month;
	};
	const year = moment().get('year');
	return year + '-' + getMonth() + '-' + getDay();
};

const games = msg => {
	console.log('$games was called');
	const getGames = (error, response, body) => {
		if (!error && response.statusCode == 200) {
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
					msg.channel.sendMessage('**Game Creator:** ' + game.creator_gamertag +
					'\n**Game Type:** ' + game.category +
					'\n**Date:** ' + gameDate +
					'\n**Time:** ' + gameTime + ' Pacific' +
					'\n**Description:** ' + game.name +
					'\n' +
					'\nThere are currently ' + '**' +((game.team_size)-(game.primary_users_count)) + '**' + ' spots available' + ' ' +
					'Game Url: ' + '<' + gameUrl+game.id + '>' +
					'\nFor help converting to your local time: <http://www.worldtimebuddy.com/>' +
					'\n================================================');
				});
			}
			else {
				msg.channel.sendMessage("There are currently no games scheduled, but since you asked, that means you want to play. Go make one!! ***It's a perfect day for some mayhem!***");
			}
		}
		else {
			console.log("Sorry there was an error!");
		}
	};
	request(gamesAuthOptions, getGames);
};

module.exports = games;
