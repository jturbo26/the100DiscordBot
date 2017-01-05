const request = require('request');
const moment = require('moment');

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
			"\n#Here are quick play stats for " + msgStatsContent +
			" (Level: "  + (quickplayData.overall_stats.prestige !== 0 ? quickplayData.overall_stats.prestige : '') + quickplayData.overall_stats.level +
			" | Games Won: " + quickplayData.overall_stats.wins +
			" | QP Time Played: " + quickplayData.game_stats.time_played + " hours)" +
			"\n\n#Lifetime Totals" +
			"\nMedals: " + quickplayData.game_stats.medals.toLocaleString() + " (G:" + quickplayData.game_stats.medals_gold.toLocaleString() + " S:" + quickplayData.game_stats.medals_silver.toLocaleString() + " B:" + quickplayData.game_stats.medals_bronze.toLocaleString() + ")" +
			"\nVoting Cards: " + quickplayData.game_stats.cards.toLocaleString() +
			"\n\nDamage Done: " + quickplayData.game_stats.damage_done.toLocaleString() +
			"\nHealing Done: " + quickplayData.game_stats.healing_done.toLocaleString() +
			"\n\nEliminations: " + quickplayData.game_stats.eliminations.toLocaleString() +
			"\nDeaths: " + quickplayData.game_stats.deaths.toLocaleString() +
			"\nEliminations per Death: " + quickplayData.game_stats.kpd.toLocaleString() +
			"\n\nObjective Kills: " + quickplayData.game_stats.objective_kills.toLocaleString() +
			"\nEnvironmental Kills: " + quickplayData.game_stats.environmental_kills.toLocaleString() +
			"\nEnvironmental Deaths: " + quickplayData.game_stats.environmental_deaths.toLocaleString() +
			"\nFinal Blows: " + quickplayData.game_stats.final_blows.toLocaleString() +
			"\nMelee Final Blows: " + quickplayData.game_stats.melee_final_blows.toLocaleString() +
			"\nSolo Kills: " + quickplayData.game_stats.solo_kills.toLocaleString() +
			"\nMultikills: " + quickplayData.game_stats.multikills.toLocaleString() +
			"\n\nOffensive Assists: " + quickplayData.game_stats.offensive_assists.toLocaleString() +
			"\nDefensive Assists: " + quickplayData.game_stats.defensive_assists.toLocaleString() +
			"\n\nTime Spent on Fire: " + moment().startOf('day').seconds(quickplayData.game_stats.time_spent_on_fire * 3600).format('H:mm:ss') + " (" + (Math.round((quickplayData.game_stats.time_spent_on_fire / quickplayData.game_stats.time_played) * 1000) / 10)  + "% of the time)" +
			"\nObjective Time: " + moment().startOf('day').seconds(quickplayData.game_stats.objective_time * 3600).format('H:mm:ss') +
			"\nTeleporter / Shield Generators Destroyed: " + quickplayData.game_stats.teleporter_pads_destroyed.toLocaleString() +

			"\n\n#Lifetime Records" +
			"\nDamage Done: " + quickplayData.game_stats.damage_done_most_in_game.toLocaleString() +
			"\nHealing Done: " + quickplayData.game_stats.healing_done_most_in_game.toLocaleString() +
			"\n\nEliminations: " + quickplayData.game_stats.eliminations_most_in_game.toLocaleString() +
			"\n\nObjective Kills: " + quickplayData.game_stats.objective_kills_most_in_game.toLocaleString() +
			"\nFinal Blows: " + quickplayData.game_stats.final_blows_most_in_game.toLocaleString() +
			"\nMelee Final Blows: " + quickplayData.game_stats.melee_final_blows_most_in_game.toLocaleString() +
			"\nSolo Kills: " + quickplayData.game_stats.solo_kills_most_in_game.toLocaleString() +
			"\nMultikill: " + quickplayData.game_stats.multikill_best.toLocaleString() +
			"\n\nOffensive Assists: " + quickplayData.game_stats.offensive_assists_most_in_game.toLocaleString() +
			"\nDefensive Assists: " + quickplayData.game_stats.defensive_assists_most_in_game.toLocaleString() +
			"\n\nTime Spent on Fire: " + moment().startOf('day').seconds(quickplayData.game_stats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') +
			"\nObjective Time: " + moment().startOf('day').seconds(quickplayData.game_stats.objective_time_most_in_game * 3600).format('H:mm:ss') +
		  "```");
	}

	const getCompUserStats = (error, response, parsedBody) => {
		const competitiveData = parsedBody.us.stats.competitive;
		const emptyObjectCompChecker = Object.getOwnPropertyNames(competitiveData);
		if (emptyObjectCompChecker.length === 0 || emptyObjectCompChecker.length === 0) {
			msg.reply("Sorry. This user has missing data. Boo boo doo de doo.");
			return;
		}
		// Sucrizzle - Playing with Git commits
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
		if (parsedBody.error !== 404 || parsedBody.error !== 500) {
			fn(error, response, parsedBody)
		}
		else if (parsedBody.error === 500 ) {
					msg.reply("Bwa Bwa Bwa Bwa. There is an issue with the Overwatch API. Try again later.");
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
