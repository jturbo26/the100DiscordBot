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

	const getUserStats = (error, response, parsedBody) => {
		const quickplayData = parsedBody.us.stats.quickplay;
		const competitiveData = parsedBody.us.stats.competitive;
		const emptyObjectQpChecker = Object.getOwnPropertyNames(quickplayData);
		const emptyObjectCompChecker = Object.getOwnPropertyNames(competitiveData);
		if (emptyObjectQpChecker.length === 0 || emptyObjectCompChecker.length === 0) {
			msg.reply("Sorry. This user has missing data. Boo boo doo de doo.");
			return;
		}
		msg.reply("```Markdown" +
			"\n#Here are basic stats for " + msgStatsContent +
			"\nLevel: "  + (quickplayData.overall_stats.prestige !== 0 ? quickplayData.overall_stats.prestige : '') + quickplayData.overall_stats.level +
			"\nComp Rank: " + (competitiveData.overall_stats.comprank !== null ? competitiveData.overall_stats.comprank : "Not Ranked") + "```");
	}

	const getCompUserStats = (error, response, parsedBody) => {
		const competitiveData = parsedBody.us.stats.competitive;
		const emptyObjectCompChecker = Object.getOwnPropertyNames(competitiveData);
		if (emptyObjectCompChecker.length === 0 || emptyObjectCompChecker.length === 0) {
			msg.reply("Sorry. This user has missing data. Boo boo doo de doo.");
			return;
		}
		msg.reply("```Markdown" +
			"\n#Here are competitive stats for " + msgCompStatsContent +
			" (CompRank: " + (competitiveData.overall_stats.comprank !== null
				? (competitiveData.overall_stats.comprank +
					" | Current Tier: " + competitiveData.overall_stats.tier.charAt(0).toUpperCase() + competitiveData.overall_stats.tier.slice(1) +
					" | Time Played: " + competitiveData.game_stats.time_played + " hours"
				  )
				: "Not Ranked") + ")" +
			"\nComp Record: " + (competitiveData.overall_stats.wins) + "-" + (competitiveData.overall_stats.losses) + '-' + (competitiveData.overall_stats.ties) +
			" (" + (competitiveData.overall_stats.win_rate) + "% Win Rate)" + "```");
			//"\nAverage Deaths: " + competitiveData.average_stats.deaths_avg + "```");
	}

	// Putting a hold on this one for now. - Turbo
	// const getAvgUserStats = (error, response, body) => {
	// 	const bodyContent = JSON.parse(body);
	// 	const competitiveData = bodyContent.us.stats.competitive;
	// 	msg.reply("```Markdown" +
	// 		"\n#This command is not ready yet. Still in development.");
	// }

	//Check the JSON to ensure the user exists. If the first
	//character of the body is '{' then the user doesn't exist.
	//Then use the function that was passed in below to display
	//the users data in discord.
	lookupCorrectFn = fn => (error, response, body) => {
		const parsedBody = JSON.parse(body);
		if (parsedBody.error !== 404) {
			fn(error, response, parsedBody)
		}
		else {
			msg.reply("Bweeeeeeeeeeeoh. There was an error finding that user. Usernames are case sensitive. Try again.");
		}
	}

	if (msg.content.startsWith('$' + 'stats')) {
		request(urls.statsOptions, lookupCorrectFn(getUserStats));
	}
	else if (msg.content.startsWith('$' + 'compstats')) {
		request(urls.compStatsOptions, lookupCorrectFn(getCompUserStats));
	}
	else if (msg.content.startsWith('$' + 'avgstats')) {
		request(urls.avgStatsOptions, lookupCorrectFn(getAvgUserStats));
	}

}

module.exports = stats;
