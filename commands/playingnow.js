const request = require('request');

const authDetails = require('../auth.json');
const the100StatusUrl = 'http://the100.io/api/v1/groups/3140/statuses';
const statusAuthOptions = {
	url: the100StatusUrl,
	headers: {
		'Authorization': authDetails.the100token
	}
};
const botResponses = {
	isPlaying: ' is playing right now!',
	says: ' here is what they say. ',
	willSherpa: ' and #willSherpa!',
	joinMe: ' and wants you to join them!',
	inviteMe: ' and wants to be invited to your group!',
	nobodyPlaying: 'Sorry! Nobody has indicated they are willing to join a group right now. :( ',
	signup: 'You can be the first though! Head over to the100.io and set your status so others know you want to group up!'
};

const playingNow = msg => {
	console.log(msg.content, " message was used");
	const getGroupStatuses = (error, response, body) => {
		if (!error && response.statusCode == 200) {
			const info = JSON.parse(body);
			if (info.length > 0) {
				info.forEach(userGamerInfo => {
					if (userGamerInfo.category === '#willsherpa') {
						msg.reply(userGamerInfo.gamertag + botResponses.isPlaying +
						botResponses.willSherpa);
					}
					else if (userGamerInfo.category === '#joinme') {
						msg.reply(userGamerInfo.gamertag + botResponses.isPlaying +
						botResponses.joinMe);
					}
					else {
						msg.reply(userGamerInfo.gamertag + botResponses.isPlaying +
						botResponses.inviteMe);
					}
				});
			}
			else {
				msg.reply(botResponses.nobodyPlaying + botResponses.signup);
			}
		}
	};
	request(statusAuthOptions, getGroupStatuses);
};

module.exports = playingNow;
