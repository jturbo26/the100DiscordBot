const request = require('request');
const moment = require('moment');

const apiV3UrlRoot = 'https://owapi.net/api/v3';

const stats = (msg, msgID) => {
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
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("Sorry. This user has missing data. Boo boo doo de doo.");
				});
			return;
			return;
		}
		msg.channel.fetchMessage(msgID)
			.then(message => {
				message.edit("```Markdown" +
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
					"\nMelee Final Blows: " + (QPGmStats.melee_final_blows ? QPGmStats.melee_final_blows.toLocaleString() : QPGmStats.melee_final_blow ? QPGmStats.melee_final_blow.toLocaleString() : "No Data") +
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
					"\nMelee Final Blows: " + (QPGmStats.melee_final_blows_most_in_game ? QPGmStats.melee_final_blows_most_in_game.toLocaleString() : QPGmStats.melee_final_blow_most_in_game ? QPGmStats.melee_final_blow_most_in_game.toLocaleString() : "No Data") +
					"\nSolo Kills: " + (QPGmStats.solo_kills_most_in_game ? QPGmStats.solo_kills_most_in_game.toLocaleString() : "No Data") +
					"\nBest Multikill: " + (QPGmStats.multikill_best ? QPGmStats.multikill_best.toLocaleString() : "No Data") +
					"\n\nOffensive Assists: " + (QPGmStats.offensive_assists_most_in_game ? QPGmStats.offensive_assists_most_in_game.toLocaleString() : "No Data") +
					"\nDefensive Assists: " + (QPGmStats.defensive_assists_most_in_game ? QPGmStats.defensive_assists_most_in_game.toLocaleString() : "No Data") +
					"\n\nTime Spent on Fire in a Single Game: " + (QPGmStats.time_spent_on_fire_most_in_game ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') : "No Data") +
					"\nObjective Time in a Single Game: " + (QPGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(QPGmStats.objective_time_most_in_game * 3600).format('H:mm:ss') : "No Data") +
				  "```");
				})
				.catch(console.error);
		}

	const getCompUserStats = (error, response, parsedBody) => {
		const competitiveData = parsedBody.us.stats.competitive;
		const compGmStats = competitiveData.game_stats;
		const compOvrStats = competitiveData.overall_stats;
		const emptyObjectCompChecker = Object.getOwnPropertyNames(competitiveData);
		if (emptyObjectCompChecker.length === 0 || emptyObjectCompChecker.length === 0) {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("Sorry. This user has missing data. Boo boo doo de doo.");
				});
			return;
		}

		// Make sure the user has played some games this comp Season.  Not sure if it would be null or 0 or ???  Taking a guess here
		if (compOvrStats.games == null || compOvrStats.games == 0) {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("You need to play some games first.  Bibbity bobbity boo");
				});
			return;
		}

		msg.channel.fetchMessage(msgID)
			.then(message => {
				message.edit("```Markdown" +
			// Can we find a way to insert player icon?
			//"\n" + compOvrStats.avatar +
			"\n#Here are competitive stats for " + msgCompStatsContent +
			" (CompRank: " + (compOvrStats.comprank !== null
				? (compOvrStats.comprank +
					" | Current Tier: " + compOvrStats.tier.charAt(0).toUpperCase() + compOvrStats.tier.slice(1) +
					" | Time Played: " + compGmStats.time_played + " hours"
				  )
				: "Not Ranked") + ")" +
			"\n\n#Current Season Totals" +
			"\nComp Record: " + (compOvrStats.wins) + "-" + (compOvrStats.losses) + '-' + (compOvrStats.ties) + " (" + (compOvrStats.win_rate) + "% Win Rate)" +
			"\nMedals: " + compGmStats.medals.toLocaleString() + " (G:" + compGmStats.medals_gold.toLocaleString() + " S:" + compGmStats.medals_silver.toLocaleString() + " B:" + compGmStats.medals_bronze.toLocaleString() + ")" +
			"\nVoting Cards: " + (compGmStats.cards ? compGmStats.cards.toLocaleString() : "No Data") +
			"\n\nDamage Done: " + (compGmStats.damage_done ? compGmStats.damage_done.toLocaleString() : "No Data") +
			"\nHealing Done: " + (compGmStats.healing_done ? compGmStats.healing_done.toLocaleString() : "No Data") +
			"\n\nEliminations: " + (compGmStats.eliminations ? compGmStats.eliminations.toLocaleString() : "No Data") +
			"\nDeaths: " + (compGmStats.deaths ? compGmStats.deaths.toLocaleString() : "No Data") +
			"\nEliminations per Death: " + (compGmStats.kpd ? compGmStats.kpd.toLocaleString() : "No Data") +
			"\n\nObjective Kills: " + (compGmStats.objective_kills ? compGmStats.objective_kills.toLocaleString() : "No Data") +
			"\nEnvironmental Kills: " + (compGmStats.environmental_kills ? compGmStats.environmental_kills.toLocaleString() : "No Data") +
			"\nEnvironmental Deaths: " + (compGmStats.environmental_deaths ? compGmStats.environmental_deaths.toLocaleString() : "No Data") +
			"\nFinal Blows: " + (compGmStats.final_blows ? compGmStats.final_blows.toLocaleString() : "No Data") +
			"\nMelee Final Blows: " + (compGmStats.melee_final_blows ? compGmStats.melee_final_blows.toLocaleString() : compGmStats.melee_final_blow ? compGmStats.melee_final_blow.toLocaleString() : "No Data") +
			"\nSolo Kills: " + (compGmStats.solo_kills ? compGmStats.solo_kills.toLocaleString() : "No Data") +
			"\nMultikills: " + (compGmStats.multikills ? compGmStats.multikills.toLocaleString() : "No Data") +
			"\n\nOffensive Assists: " + (compGmStats.offensive_assists ? compGmStats.offensive_assists.toLocaleString() : "No Data") +
			"\nDefensive Assists: " + (compGmStats.defensive_assists ? compGmStats.defensive_assists.toLocaleString() : "No Data") +
			"\n\nTime Spent on Fire: " + (compGmStats.time_spent_on_fire ? moment().startOf('day').seconds(compGmStats.time_spent_on_fire * 3600).format('H:mm:ss') + " (" + (Math.round((compGmStats.time_spent_on_fire / compGmStats.time_played) * 1000) / 10)  + "% of the time)" : "No Data") +
			"\nObjective Time: " + (compGmStats.objective_time ? moment().startOf('day').seconds(compGmStats.objective_time * 3600).format('H:mm:ss') : "No Data") +
			"\nTeleporter / Shield Generators Destroyed: " + (compGmStats.teleporter_pads_destroyed ? compGmStats.teleporter_pads_destroyed.toLocaleString() : "No Data") +

			"\n\n#Current Season Records" +
			"\nDamage Done: " + (compGmStats.damage_done_most_in_game ? compGmStats.damage_done_most_in_game.toLocaleString() : "No Data") +
			"\nHealing Done: " + (compGmStats.healing_done_most_in_game ? compGmStats.healing_done_most_in_game.toLocaleString() : "No Data") +
			"\n\nEliminations: " + (compGmStats.eliminations_most_in_game? compGmStats.eliminations_most_in_game.toLocaleString() : "No Data") +
			"\n\nObjective Kills: " + (compGmStats.objective_kills_most_in_game ? compGmStats.objective_kills_most_in_game.toLocaleString() : "No Data")+
			"\nFinal Blows: " + (compGmStats.final_blows_most_in_game ? compGmStats.final_blows_most_in_game.toLocaleString() : "No Data" ) +
			"\nMelee Final Blows: " + (compGmStats.melee_final_blows_most_in_game ? compGmStats.melee_final_blows_most_in_game.toLocaleString() : compGmStats.melee_final_blow_most_in_game ? compGmStats.melee_final_blow_most_in_game.toLocaleString() : "No Data") +
			"\nSolo Kills: " + (compGmStats.solo_kills_most_in_game ? compGmStats.solo_kills_most_in_game.toLocaleString() : "No Data") +
			"\nBest Multikill: " + (compGmStats.multikill_best ? compGmStats.multikill_best.toLocaleString() : "No Data") +
			"\n\nOffensive Assists: " + (compGmStats.offensive_assists_most_in_game ? compGmStats.offensive_assists_most_in_game.toLocaleString() : "No Data") +
			"\nDefensive Assists: " + (compGmStats.defensive_assists_most_in_game ? compGmStats.defensive_assists_most_in_game.toLocaleString() : "No Data") +
			"\n\nTime Spent on Fire in a Single Game: " + (compGmStats.time_spent_on_fire_most_in_game ? moment().startOf('day').seconds(compGmStats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') : "No Data") +
			"\nObjective Time in a Single Game: " + (compGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(compGmStats.objective_time_most_in_game * 3600).format('H:mm:ss') : "No Data") +
			 "```");
		 })
	 }

	lookupCorrectFn = fn => (error, response, body) => {
		//Let user know that the bot is working on the request
		const parsedBody = JSON.parse(body);

		// Will work on this later. - Turbo
		// const errors = {
		// 	404: "Error! Error! Error!...",
		// 	500: "Bwa Bwa Bwa Bwa. There is an issue with the Overwatch API. Try again later.",
		// 	429: "Bweeeeeeeeeeeoh. Try again in a few seconds. The Overwatch API is being poked too much"
		// }

		if (parsedBody.error !== 404 && parsedBody.error !== 500) {
			fn(error, response, parsedBody)
		}
		else if (parsedBody.error === 500 ) {
			msg.reply("Bwa Bwa Bwa Bwa. There is an issue with the Overwatch API. Try again later.");
		}
		else {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					console.log("id=", msgID, "message=", message);
					message.edit("Bweeeeeeeeeeeoh. There was an error finding that user. Usernames are case sensitive. Try again.");
				})
				.catch(console.error);
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
