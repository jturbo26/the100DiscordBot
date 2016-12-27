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
		msg.reply("```Markdown" +
			"\n#Here are competitive stats for " + msgCompStatsContent + " (CompRank: " + bodyContent.us.stats.competitive.overall_stats.comprank + ")" +
			"\nAverage Deaths: " + bodyContent.us.stats.competitive.average_stats.deaths_avg + "```");
	}

	const getCompUserStats = (error, response, body) => {
		const bodyContent = JSON.parse(body);
		msg.reply("```Markdown" +
			"\n#Here are competitive stats for " + msgCompStatsContent + " (CompRank: " + bodyContent.us.stats.competitive.overall_stats.comprank + ")" +
			'\n![Avatar]("' + bodyContent.us.stats.competitive.overall_stats.avatar + ')' +
			"\nAverage Deaths: " + bodyContent.us.stats.competitive.average_stats.deaths_avg + "```");
	}

	const getAvgUserStats = (error, response, body) => {
		const bodyContent = JSON.parse(body);
		msg.reply("```Markdown" +
			"\n#Here are competitive stats for " + msgCompStatsContent + " (CompRank: " + bodyContent.us.stats.competitive.overall_stats.comprank + ")" +
			'\n![Avatar]("' + bodyContent.us.stats.competitive.overall_stats.avatar + ')' +
			"\nAverage Deaths: " + bodyContent.us.stats.competitive.average_stats.deaths_avg + "```");
	}

	if (msg.content.startsWith('$' + 'stats')) {
		request(urls.statsOptions, getUserStats);
	}
	else if (msg.content.startsWith('$' + 'compstats')) {
		request(urls.compStatsOptions, getCompUserStats);
	}
	else if (msg.content.startsWith('$' + 'avgstats')) {
		request(urls.avgStatsOptions, getUserStats);
	}
}

module.exports = stats;

// msg.reply("```Markdown" +
// 	"\n#Here are competitive average stats for " + msgContent +
// 	"\nAverage Deaths: " + bodyContent.us.stats.competitive.average_stats.deaths_avg + "```");
// console.log(bodyContent.us.stats.competitive);
// msg.reply(body.us.stats.competitive.average_stats)

// msg.content.startsWith(prefix + 'stats') ||
// msg.content.startsWith(prefix + 'compstats') ||
// msg.content.startsWith(prefix + 'avgstats')

// stats":{
//      .............Lots skipped
//          "competitive":{
//             "average_stats":{
//                "deaths_avg":8.6,
//                "defensive_assists_avg":3.0,
//                "eliminations_avg":24.08,
//                "melee_final_blows_avg":0.04,
//                "offensive_assists_avg":0.0,
//                "damage_done_avg":13690.0,
//                "solo_kills_avg":3.32,
//                "healing_done_avg":2323.0,
//                "time_spent_on_fire_avg":0.026944444444444444,
//                "final_blows_avg":12.84,
//                "objective_kills_avg":12.36,
//                "objective_time_avg":0.020555555555555556
//             },
//             "competitive":true,
//             "overall_stats":{
//                "level":41,
//                "losses":11,
//                "win_rate":52,
//                "games":25,
//                "comprank":1672,
//                "avatar":"https://blzgdapipro-a.akamaihd.net/game/unlocks/0x0250000000000D69.png",
//                "wins":12,
//                "prestige":1,
//                "ties":2
//             },
//             "game_stats":{
//                "games_played":25.0,
//                "melee_final_blow":1.0,
//                "objective_kills_most_in_game":34.0,
//                "offensive_assists_most_in_game":4.0,
//                "eliminations":602.0,
//                "objective_time":0.5180555555555555,
//                "final_blows":321.0,
//                "deaths":215.0,
//                "solo_kills":83.0,
//                "time_spent_on_fire_most_in_game":0.1075,
//                "healing_done":58067.0,
//                "melee_final_blow_most_in_game":1.0,
//                "medals_silver":25.0,
//                "time_spent_on_fire":0.673611111111111,
//                "medals_gold":33.0,
//                "damage_done":342252.0,
//                "cards":14.0,
//                "multikill_best":4.0,
//                "offensive_assists":8.0,
//                "games_lost":11.0,
//                "objective_time_most_in_game":0.0525,
//                "defensive_assists":63.0,
//                "environmental_deaths":3.0,
//                "games_tied":2.0,
//                "multikills":12.0,
//                "final_blows_most_in_game":39.0,
//                "healing_done_most_in_game":11785.0,
//                "environmental_kills":10.0,
//                "medals":76.0,
//                "damage_done_most_in_game":34704.0,
//                "objective_kills":309.0,
//                "kpd":2.8,
//                "games_won":12.0,
//                "solo_kills_most_in_game":39.0,
//                "eliminations_most_in_game":55.0,
//                "defensive_assists_most_in_game":14.0,
//                "medals_bronze":18.0,
//                "time_played":5.0
//             }
//          }
//       }
