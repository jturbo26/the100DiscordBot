const request = require('request');

const apiV3UrlRoot = 'https://owapi.net/api/v3';

const stats = msg => {
	const msgStatsContent = msg.content.slice(7);
	const msgCompStatsContent = msg.content.slice(11);
	const msgAvgStatsContent = msg.content.slice(10);
	const contentReplacePoundStats = msgStatsContent.replace('#', '-');
	const contentReplacePoundCompStats = msgCompStatsContent.replace('#', '-');
	const contentReplacePoundAvgStats = msgAvgStatsContent.replace('#', '-');

	const urls = {
		statsOptions : {
			url: `${apiV3UrlRoot}/u/${contentReplacePoundStats}/stats`,
			headers: {
				'User-Agent': 'CC337'
			}
		},
		compStatsOptions: {
			url: `${apiV3UrlRoot}/u/${contentReplacePoundCompStats}/stats`,
			headers: {
				'User-Agent': 'CC337'
			}
		},
		avgStatsOptions: {
			url: `${apiV3UrlRoot}/u/${contentReplacePoundAvgStats}/stats`,
			headers: {
				'User-Agent': 'CC337'
			}
		}
	}

	const getUserStats = (error, response, body) => {
		const bodyContent = JSON.parse(body);
		const quickplayData = bodyContent.us.stats.quickplay;
		const competitiveData = bodyContent.us.stats.competitive;
		msg.reply("```Markdown" +
			"\n#Here are basic stats for " + msgStatsContent +
			"\nLevel: "  + quickplayData.overall_stats.prestige + quickplayData.overall_stats.level + "```" +
			"\nCompRank: " + (competitiveData.overall_stats.comprank !== null ? competitiveData.overall_stats.comprank : "Not Ranked") + ")");
	}

	const getCompUserStats = (error, response, body) => {
		const bodyContent = JSON.parse(body);
		const competitiveData = bodyContent.us.stats.competitive;
		const emptyObjectChecker = Object.getOwnPropertyNames(competitiveData);
		if (response.statusCode === 200) {
			if (emptyObjectChecker.length === 0) {
				msg.reply("Sorry. This user doesn't have any competitive data.");
				return;
			}
			msg.reply("```Markdown" +
				"\n#Here are competitive stats for " + msgCompStatsContent +
				" (CompRank: " + (competitiveData.overall_stats.comprank !== null ? competitiveData.overall_stats.comprank : "Not Ranked") + ")" +
				"\nAverage Deaths: " + competitiveData.average_stats.deaths_avg + "```");
		}
		else {
			msg.reply("Error! Status Code = " + response.statusCode);
		}
	}

	const getAvgUserStats = (error, response, body) => {
		const bodyContent = JSON.parse(body);
		const competitiveData = bodyContent.us.stats.competitive;
		msg.reply("```Markdown" +
			"\n#Here are competitive stats for " + msgAvgStatsContent + " (CompRank: " + competitiveData.overall_stats.comprank + ")" +
			'\n![Avatar]("' + competitiveData.overall_stats.avatar + ')' +
			"\nAverage Deaths: " + competitiveData.average_stats.deaths_avg + "```");
	}

	// // Here are the actual calls to the API using npm request.
	// if (msg.content.startsWith('$' + 'stats')) {
	// 	request(urls.statsOptions, getUserStats);
	// }
	// else if (msg.content.startsWith('$' + 'compstats')) {
	// 	request(urls.compStatsOptions, getCompUserStats);
	// }
	// else if (msg.content.startsWith('$' + 'avgstats')) {
	// 	request(urls.avgStatsOptions, getUserStats);
	// }

	someThing = fn => (error, response, body) => {
		if (body[0] === '{') {
			fn(error, response, body)
		}
	}

	if (msg.content.startsWith('$' + 'stats')) {
		request(urls.statsOptions, someThing(getUserStats));
	}
	else if (msg.content.startsWith('$' + 'compstats')) {
		request(urls.compStatsOptions, someThing(getCompUserStats));
	}
	else if (msg.content.startsWith('$' + 'avgstats')) {
		request(urls.avgStatsOptions, someThing(getUserStats));
	}

}

module.exports = stats;
