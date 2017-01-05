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
		const QPGmStats = quickplayData.game_stats;
		const QPOvrStats = quickplayData.overall_stats;
		const competitiveData = parsedBody.us.stats.competitive;
		const emptyObjectQpChecker = Object.getOwnPropertyNames(quickplayData);
		const emptyObjectCompChecker = Object.getOwnPropertyNames(competitiveData);
		if (emptyObjectQpChecker.length === 0 || emptyObjectCompChecker.length === 0) {
			msg.reply("Sorry. This user has missing data. Boo boo doo de doo.");
			return;
		}
		msg.reply("```Markdown" +
			"\n#Here are quick play stats for " + msgStatsContent +
			" (Level: "  + (QPOvrStats.prestige !== 0 ? QPOvrStats.prestige : '') + QPOvrStats.level +
			" | Games Won: " + QPOvrStats.wins +
			" | QP Time Played: " + QPGmStats.time_played + " hours)" +
			"\n\n#Lifetime Totals" +
			"\nMedals: " + QPGmStats.medals.toLocaleString() + " (G:" + QPGmStats.medals_gold.toLocaleString() + " S:" + QPGmStats.medals_silver.toLocaleString() + " B:" + QPGmStats.medals_bronze.toLocaleString() + ")" +
			"\nVoting Cards: " + (QPGmStats.cards ? QPGmStats.cards.toLocaleString() : "No Data") +
			"\n\nDamage Done: " + (QPGmStats.damage_done ? QPGmStats.damage_done.toLocaleString() : "No Data") +
			"\nHealing Done: " + (QPGmStats.healing_done ? QPGmStats.healing_done.toLocaleString() : "No Data") +
			"\n\nEliminations: " + (QPGmStats.eliminations ? QPGmStats.eliminations.toLocaleString() : "No Data") +
			"\nDeaths: " + (QPGmStats.deaths ? QPGmStats.deaths.toLocaleString() : "No Data") +
			"\nEliminations per Death: " + (QPGmStats.kpd ? QPGmStats.kpd.toLocaleString() : "No Data") +
			"\n\nObjective Kills: " + (QPGmStats.objective_kills ? QPGmStats.objective_kills.toLocaleString() : "No Data") +
			"\nEnvironmental Kills: " + (QPGmStats.environmental_kills ? QPGmStats.environmental_kills.toLocaleString() : "No Data") +
			"\nEnvironmental Deaths: " + (QPGmStats.environmental_deaths ? QPGmStats.environmental_deaths.toLocaleString() : "No Data") +
			"\nFinal Blows: " + (QPGmStats.final_blows ? QPGmStats.final_blows.toLocaleString() : "No Data") +
			"\nMelee Final Blows: " + (QPGmStats.melee_final_blows ? QPGmStats.melee_final_blows.toLocaleString() : "No Data") +
			"\nSolo Kills: " + (QPGmStats.solo_kills ? QPGmStats.solo_kills.toLocaleString() : "No Data") +
			"\nMultikills: " + (QPGmStats.multikills ? QPGmStats.multikills.toLocaleString() : "No Data") +
			"\n\nOffensive Assists: " + (QPGmStats.offensive_assists ? QPGmStats.offensive_assists.toLocaleString() : "No Data") +
			"\nDefensive Assists: " + (QPGmStats.defensive_assists ? QPGmStats.defensive_assists.toLocaleString() : "No Data") +
			"\n\nTime Spent on Fire: " + (QPGmStats.time_spent_on_fire ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire * 3600).format('H:mm:ss') + " (" + (Math.round((QPGmStats.time_spent_on_fire / QPGmStats.time_played) * 1000) / 10)  + "% of the time)" : "No Data") +
			"\nObjective Time: " + (QPGmStats.objective_time ? moment().startOf('day').seconds(QPGmStats.objective_time * 3600).format('H:mm:ss') : "No Data") +
			"\nTeleporter / Shield Generators Destroyed: " + (QPGmStats.teleporter_pads_destroyed ? QPGmStats.teleporter_pads_destroyed.toLocaleString() : "No Data") +

			"\n\n#Lifetime Records" +
			"\nDamage Done: " + (QPGmStats.damage_done_most_in_game ? QPGmStats.damage_done_most_in_game.toLocaleString() : "No Data") +
			"\nHealing Done: " + (QPGmStats.healing_done_most_in_game ? QPGmStats.healing_done_most_in_game.toLocaleString() : "No Data") +
			"\n\nEliminations: " + (QPGmStats.eliminations_most_in_game? QPGmStats.eliminations_most_in_game.toLocaleString() : "No Data") +
			"\n\nObjective Kills: " + (QPGmStats.objective_kills_most_in_game ? QPGmStats.objective_kills_most_in_game.toLocaleString() : "No Data")+
			"\nFinal Blows: " + (QPGmStats.final_blows_most_in_game ? QPGmStats.final_blows_most_in_game.toLocaleString() : "No Data" ) +
			// Need to work on this one to catch if the user only has 1 killing blow and return 1 instead of No Data.
			"\nMelee Final Blows: " + (QPGmStats.melee_final_blows_most_in_game ? QPGmStats.melee_final_blows_most_in_game.toLocaleString() : "No Data") +
			"\nSolo Kills: " + (QPGmStats.solo_kills_most_in_game ? QPGmStats.solo_kills_most_in_game.toLocaleString() : "No Data") +
			"\nMultikill: " + (QPGmStats.multikill_best ? QPGmStats.multikill_best.toLocaleString() : "No Data") +
			"\n\nOffensive Assists: " + (QPGmStats.offensive_assists_most_in_game ? QPGmStats.offensive_assists_most_in_game.toLocaleString() : "No Data") +
			"\nDefensive Assists: " + (QPGmStats.defensive_assists_most_in_game ? QPGmStats.defensive_assists_most_in_game.toLocaleString() : "No Data") +
			"\n\nTime Spent on Fire in a Single Game: " + (QPGmStats.time_spent_on_fire_most_in_game ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') : "No Data") +
			"\nObjective Time in a Single Game: " + (QPGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(QPGmStats.objective_time_most_in_game * 3600).format('H:mm:ss') : "No Data") +
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

		// Will work on this later. - Turbo
		// const errors = {
		// 	404: "Error! Error! Error!...",
		// 	500: "Bwa Bwa Bwa Bwa. There is an issue with the Overwatch API. Try again later.",
		// 	429: "Bweeeeeeeeeeeoh. Try again in a few seconds. The Overwatch API is being poked too much"
		// }

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

	if (msg.content.startsWith('$stats')) {
		request(urls.statsOptions, lookupCorrectFn(getUserStats));
	}
	else if (msg.content.startsWith('$compstats')) {
		request(urls.compStatsOptions, lookupCorrectFn(getCompUserStats));
	}
	else if (msg.content.startsWith('$avgstats')) {
		request(urls.avgStatsOptions, lookupCorrectFn(getAvgUserStats));
	}

}

module.exports = stats;
