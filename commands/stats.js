const request = require('request');

const apiV3UrlRoot = 'https://owapi.net/api/v3';

const stats = msg => {
	const msgContent = msg.content.slice(7);
	const contentReplacePound = msgContent.replace('#', '-');
	const getUserStatsUrl = `${apiV3UrlRoot}/u/${contentReplacePound}/stats`;

	const apiOptions = {
		url: getUserStatsUrl,
		headers: {
			'User-Agent': 'CC337'
		}
	}

	const getUserStats = (error, response, body) => {
		const bodyContent = JSON.parse(body);
		console.log(response);
		msg.reply(`Here are your competitive average stats-.
			Average Deaths: ${bodyContent.us.stats.competitive.average_stats.deaths_avg}`);
		//console.log(bodyContent.us.stats.competitive);
		//msg.reply(body.us.stats.competitive.average_stats)
	}

	request(apiOptions, getUserStats);


}

module.exports = stats;
