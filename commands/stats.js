const request = require('request');
const moment = require('moment');
const Discord = require('discord.js')

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
		}
		//Embed version of the stats display
		const embed = new Discord.RichEmbed()
			.setAuthor(msgStatsContent + '\'s Quick Play Information', QPOvrStats.avatar)
			.setColor(0x00AE86)
			.setTimestamp()
			.setURL()
			.setFooter('© Brought to you by TurboJoe & Sucrizzle')
			//.setThumbnail(QPOvrStats.avatar)
			.addField('__Quick Play Statistics__', ('**Level:** ' + (QPOvrStats.prestige !== 0 ? QPOvrStats.prestige : '') + QPOvrStats.level
																								+ '\n\n**Time Played:** ' + QPGmStats.time_played.toLocaleString() + ' hours'
																								+ '\n**Record:** ' + QPOvrStats.wins.toLocaleString() + '-' + QPOvrStats.losses.toLocaleString()
																								+ ' (' + QPOvrStats.win_rate + '% Win Rate in ' + QPOvrStats.games.toLocaleString() + ' games)'
																							  + '\n\n**Voting Cards Earned:** ' + QPGmStats.cards.toLocaleString()
																							  + '\n**Medals Awarded:** ' + QPGmStats.medals.toLocaleString()
																								+ ' (G: ' + QPGmStats.medals_gold.toLocaleString() + ' S: ' + QPGmStats.medals_silver.toLocaleString() +  ' B: ' + QPGmStats.medals_bronze.toLocaleString() + ')'
																							  )
							 )
			.addField('__Eliminations__', '**Average: **' + (QPGmStats.eliminations ? (QPGmStats.eliminations / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
			                          + ' (' + (QPGmStats.kpd ? QPGmStats.kpd.toLocaleString() : "-") + 'k/d)'
			                          + '\n**Most: **' + (QPGmStats.eliminations_most_in_game ? QPGmStats.eliminations_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (QPGmStats.eliminations ? QPGmStats.eliminations.toLocaleString() : '-')
			,true)
			.addField('__Damage__', '**Average: **' + (QPGmStats.damage_done ? (QPGmStats.damage_done / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
			                          + '\n**Most: **' + (QPGmStats.damage_done_most_in_game ? QPGmStats.damage_done_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (QPGmStats.damage_done ? QPGmStats.damage_done.toLocaleString() : '-')
			, true)
			.addField('__Healing__', '**Average: **' + (QPGmStats.healing_done ? (QPGmStats.healing_done / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (QPGmStats.healing_done_most_in_game ? QPGmStats.healing_done_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (QPGmStats.healing_done ? QPGmStats.healing_done.toLocaleString() : '-')
			, true)
			.addField('__Solo Kills__', '**Average: **' + (QPGmStats.solo_kills ? (QPGmStats.solo_kills / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (QPGmStats.solo_kills_most_in_game ? QPGmStats.solo_kills_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (QPGmStats.solo_kills ? QPGmStats.solo_kills.toLocaleString() : '-')
			,true)
			.addField('__Final Blows__', '**Average: **' + (QPGmStats.final_blows ? (QPGmStats.final_blows / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (QPGmStats.final_blows_most_in_game ? QPGmStats.final_blows_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (QPGmStats.final_blows ? QPGmStats.final_blows.toLocaleString() : '-')
			, true)
			.addField('__Melee Kills__', '**Average: **' + (QPGmStats.melee_final_blows ? (QPGmStats.melee_final_blows / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : QPGmStats.melee_final_blow ? (QPGmStats.melee_final_blow/ QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : "-")
																+ '\n**Most: **' + (QPGmStats.melee_final_blows_most_in_game ? QPGmStats.melee_final_blows_most_in_game.toLocaleString() : QPGmStats.melee_final_blow_most_in_game ? QPGmStats.melee_final_blow_most_in_game.toLocaleString() : "-")
																+ '\n**Total: **' + (QPGmStats.melee_final_blows ? QPGmStats.melee_final_blows.toLocaleString() : QPGmStats.melee_final_blow ? QPGmStats.melee_final_blow.toLocaleString() : "-")
			, true)
			.addField('__Objectives Kills__', '**Average: **' + (QPGmStats.objective_kills ? (QPGmStats.objective_kills / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (QPGmStats.objective_kills_most_in_game ? QPGmStats.objective_kills_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (QPGmStats.objective_kills ? QPGmStats.objective_kills.toLocaleString() : '-')
			, true)
			.addField('__Offensive Assists__', '**Average: **' + (QPGmStats.offensive_assists ? (QPGmStats.offensive_assists / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (QPGmStats.offensive_assists_most_in_game ? QPGmStats.offensive_assists_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (QPGmStats.offensive_assists ? QPGmStats.offensive_assists.toLocaleString() : '-')
			, true)
			.addField('__Defensive Assists__', '**Average: **' + (QPGmStats.defensive_assists ? (QPGmStats.defensive_assists / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (QPGmStats.defensive_assists_most_in_game ? QPGmStats.defensive_assists_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (QPGmStats.defensive_assists ? QPGmStats.defensive_assists.toLocaleString() : '-')
			, true)
			.addField('__Objective Time__', '**Average: **' + (QPGmStats.objective_time ? moment().startOf('day').seconds((QPGmStats.objective_time / QPOvrStats.games) * 3600).format('H:mm:ss') : '-')
																+ '\n**Most: **' + (QPGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(QPGmStats.objective_time_most_in_game * 3600).format('H:mm:ss') : '-')
																+ '\n**Total: **' + (QPGmStats.objective_time ? moment().startOf('day').seconds(QPGmStats.objective_time * 3600).format('H:mm:ss') : '-')
			, true)
			.addField('__Time on Fire__', '**Average: **' + (QPGmStats.time_spent_on_fire ? moment().startOf('day').seconds((QPGmStats.time_spent_on_fire / QPOvrStats.games) * 3600).format('H:mm:ss') : '-')
																+ '\n**Most: **' + (QPGmStats.time_spent_on_fire_most_in_game ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') : '-')
																+ '\n**Total: **' + (QPGmStats.time_spent_on_fire ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire * 3600).format('H:mm:ss') : '-')
			, true)
			.addField('__Other Stats__', '**Multikills: **' + (QPGmStats.multikills ? QPGmStats.multikills.toLocaleString() : '-')
			                          + ' (Best Multikill: ' + (QPGmStats.multikill_best ? QPGmStats.multikill_best.toLocaleString() : '-') + ')'
																+ '\n**Environmental Kills: **' + (QPGmStats.environmental_kills ? QPGmStats.environmental_kills.toLocaleString() : '-')
																+ '\n**Environmental Deaths:** ' + (QPGmStats.environmental_deaths ? QPGmStats.environmental_deaths.toLocaleString() : '-')
																+ '\n**Turrets Destroyed:** ' + (QPGmStats.turrets_destroyed ? QPGmStats.turrets_destroyed.toLocaleString() : '-')
																+ '\n**Teleporters Destroyed:** ' + (QPGmStats.teleporter_pads_destroyed ? QPGmStats.teleporter_pads_destroyed.toLocaleString() : '-')
																+ '\n**Shield Generators Destroyed:** ' + (QPGmStats.shield_generators_destroyed ? QPGmStats.shield_generators_destroyed.toLocaleString() : '-')

			)
			/*('**Eliminations per Death:** ' + (QPGmStats.kpd ? QPGmStats.kpd.toLocaleString() : "No Data")
	                                        + ' (E: ' + (QPGmStats.eliminations ? QPGmStats.eliminations.toLocaleString() : 'No Data')
	                                        + ' D: ' + (QPGmStats.deaths ? QPGmStats.deaths.toLocaleString() : 'No Data') + ')'
																					+ '\n**Objective Time:** ' + (QPGmStats.objective_time ? moment().startOf('day').seconds(QPGmStats.objective_time * 3600).format('H:mm:ss') : "No Data")
																					+ '\n**Time Spent on Fire:** ' + (QPGmStats.time_spent_on_fire ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire * 3600).format('H:mm:ss') + " (" + (Math.round((QPGmStats.time_spent_on_fire / QPGmStats.time_played) * 1000) / 10)  + "%)" : "No Data")
																					+ '\n\n**Damage Done:** ' + (QPGmStats.damage_done ? QPGmStats.damage_done.toLocaleString() : "No Data")
																					+ '\n**Healing Done:** ' + (QPGmStats.healing_done ? QPGmStats.healing_done.toLocaleString() : "No Data")
																					+ '\n\n**Solo Kills:** ' + (QPGmStats.solo_kills ? QPGmStats.solo_kills.toLocaleString() : "No Data")
	                                        + '\n**Objective Kills:** ' + (QPGmStats.objective_kills ? QPGmStats.objective_kills.toLocaleString() : "No Data")
																					+ '\n**Multikills:** ' + (QPGmStats.multikills ? QPGmStats.multikills.toLocaleString() : "No Data")
																					+ '\n\n**Final Blows:** ' +  (QPGmStats.final_blows ? QPGmStats.final_blows.toLocaleString() : "No Data")
																					+ '\n**Melee Final Blows:** ' + (QPGmStats.melee_final_blows ? QPGmStats.melee_final_blows.toLocaleString() : QPGmStats.melee_final_blow ? QPGmStats.melee_final_blow.toLocaleString() : "No Data")
																					+ '\n\n**Environmental Kills:** ' + (QPGmStats.environmental_kills ? QPGmStats.environmental_kills.toLocaleString() : "No Data")
																					+ '\n**Environmental Deaths:** ' + (QPGmStats.environmental_deaths ? QPGmStats.environmental_deaths.toLocaleString() : "No Data")
																					+ '\n\n**Assists:** ' + ((QPGmStats.offensive_assists + QPGmStats.defensive_assists) ? (QPGmStats.offensive_assists + QPGmStats.defensive_assists).toLocaleString() : 'No Data')
																					+ ' (Off: ' + (QPGmStats.offensive_assists ? QPGmStats.offensive_assists.toLocaleString() : '0') + ' Def: ' + (QPGmStats.defensive_assists ? QPGmStats.defensive_assists.toLocaleString() : '0') + ')'
																					+ '\n**Teleporters Destroyed:** ' + (QPGmStats.teleporter_pads_destroyed ? QPGmStats.teleporter_pads_destroyed.toLocaleString() : "No Data")
																					+ '\n**Shield Generators Destroyed:** ' + (QPGmStats.shield_generators_destroyed ? QPGmStats.shield_generators_destroyed.toLocaleString() : "No Data")
																		     )
								)*/
			 /*.addField('__Quick Play Single Game Records__', ('**Eliminations:** ' + (QPGmStats.eliminations_most_in_game? QPGmStats.eliminations_most_in_game.toLocaleString() : "No Data")
																						+ '\n**Objective Time:** ' + (QPGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(QPGmStats.objective_time_time_most_in_game * 3600).format('H:mm:ss') : "No Data")
																						+ '\n**Time Spent on Fire:** ' + (QPGmStats.time_spent_on_fire_time_most_in_game ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire_time_most_in_game * 3600).format('H:mm:ss') : "No Data")
																						+ '\n\n**Damage Done:** ' + (QPGmStats.damage_done_time_most_in_game ? QPGmStats.damage_done_time_most_in_game.toLocaleString() : "No Data")
																						+ '\n**Healing Done:** ' + (QPGmStats.healing_done_time_most_in_game ? QPGmStats.healing_done_time_most_in_game.toLocaleString() : "No Data")
																						+ '\n\n**Solo Kills:** ' + (QPGmStats.solo_kills_time_most_in_game ? QPGmStats.solo_kills_time_most_in_game.toLocaleString() : "No Data")
	                                          + '\n**Objective Kills:** ' + (QPGmStats.objective_kills_time_most_in_game ? QPGmStats.objective_kills_time_most_in_game.toLocaleString() : "No Data")
																						+ '\n**Best Multikill:** ' + (QPGmStats.multikill_best ? QPGmStats.multikill_best.toLocaleString() : "No Data")
																						+ '\n\n**Final Blows:** ' +  (QPGmStats.final_blows_time_most_in_game ? QPGmStats.final_blows_time_most_in_game.toLocaleString() : "No Data")
																						+ '\n**Melee Final Blows:** ' + (QPGmStats.melee_final_blow_time_most_in_games ? QPGmStats.melee_final_blows_time_most_in_game.toLocaleString() : QPGmStats.melee_final_blow_time_most_in_game ? QPGmStats.melee_final_blow_time_most_in_game.toLocaleString() : "No Data")
																						+ '\n\n**Offensive Assists:** ' + (QPGmStats.offensive_assists_time_most_in_game ? QPGmStats.offensive_assists_time_most_in_game.toLocaleString() : 'No Data')
																						+ '\n**Defensive Assists:** ' + (QPGmStats.defensive_assists_time_most_in_game ? QPGmStats.defensive_assists_time_most_in_game.toLocaleString() : 'No Data')
																					)
		           )*/
			;

			// Edit the original response with the embed
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit(message.channel.sendEmbed(embed, {disableEveryone: true}))})
			.catch(console.error);
		//msg.edit(msg.channel.sendEmbed(embed, {disableEveryone: true}))

		/* Old version of the code




					"\n\nTime Spent on Fire: " + (QPGmStats.time_spent_on_fire ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire * 3600).format('H:mm:ss') + " (" + (Math.round((QPGmStats.time_spent_on_fire / QPGmStats.time_played) * 1000) / 10)  + "% of the time)" : "No Data") +
					"\nObjective Time: " + (QPGmStats.objective_time ? moment().startOf('day').seconds(QPGmStats.objective_time * 3600).format('H:mm:ss') : "No Data") +
					"\nTeleporter Pads Destroyed: " + (QPGmStats.teleporter_pads_destroyed ? QPGmStats.teleporter_pads_destroyed.toLocaleString() : "No Data") +
					"\nShield Generators Destroyed: " + (QPGmStats.shield_generators_destroyed ? QPGmStats.shield_generators_destroyed.toLocaleString() : "No Data") +
					"\n\n#Lifetime Records" +

					"\nFinal Blows: " + (QPGmStats.final_blows_most_in_game ? QPGmStats.final_blows_most_in_game.toLocaleString() : "No Data" ) +
					"\nMelee Final Blows: " + (QPGmStats.melee_final_blows_most_in_game ? QPGmStats.melee_final_blows_most_in_game.toLocaleString() : QPGmStats.melee_final_blow_most_in_game ? QPGmStats.melee_final_blow_most_in_game.toLocaleString() : "No Data") +

					"\n\nOffensive Assists: " + (QPGmStats.offensive_assists_most_in_game ? QPGmStats.offensive_assists_most_in_game.toLocaleString() : "No Data") +
					"\nDefensive Assists: " + (QPGmStats.defensive_assists_most_in_game ? QPGmStats.defensive_assists_most_in_game.toLocaleString() : "No Data") +
					"\n\nTime Spent on Fire in a Single Game: " + (QPGmStats.time_spent_on_fire_most_in_game ? moment().startOf('day').seconds(QPGmStats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') : "No Data") +
					"\nObjective Time in a Single Game: " + (QPGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(QPGmStats.objective_time_most_in_game * 3600).format('H:mm:ss') : "No Data") +
				  "```");

				})
				.catch(console.error);
			*/
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
			"\nTeleporter Pads Destroyed: " + (compGmStats.teleporter_pads_destroyed ? compGmStats.teleporter_pads_destroyed.toLocaleString() : "No Data") +
			"\nShield Generators Destroyed: " + (compGmStats.shield_generators_destroyed ? compGmStats.shield_generators_destroyed.toLocaleString() : "No Data") +

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
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("Bwa Bwa Bwa Bwa. There is an issue with the Overwatch API. Try again later.");
				})
		}
		else {
			msg.channel.fetchMessage(msgID)
				.then(message => {
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
