const request = require('request');
const moment = require('moment');
const Discord = require('discord.js')
const getConnectionRunQuery = require('../utils/getConnectionRunQuery.js')

const apiV3UrlRoot = 'https://owapi.net/api/v3';

const stats = (msg, msgID, dbConnectionPool) => {
	// Setup variables required for the function
	var msgStatsContent = '';
	var contentReplacePoundStats = '';
  var commLen = 0;
	var urls = {};

	const getCompUserStats = (error, response, parsedBody) => {
		const competitiveData = parsedBody.us.stats.competitive;
		const compGmStats = competitiveData.game_stats;
		const compOvrStats = competitiveData.overall_stats;
		const compAvgStats = competitiveData.average_stats;
		const emptyObjectCompChecker = Object.getOwnPropertyNames(competitiveData);
		if (emptyObjectCompChecker.length === 0 || emptyObjectCompChecker.length === 0) {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("Sorry. This user has missing data. Boo boo doo de doo.");
				});
			return;
		}

		// Make sure the user has played some games this comp Season.  Not sure if it would be null or 0 or ???  Taking a guess here
		if (compOvrStats.games == null || (compOvrStats.games == 0 && compGmStats.games == 0)) {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("You need to play some games first.  Bibbity bobbity boo");
				});
			return;
		}
		// Build links to the comp icons
		const compIconDict = {
			'bronze':      'http://vignette4.wikia.nocookie.net/overwatch/images/8/8f/Competitive_Bronze_Icon.png',
			'silver':      'http://vignette4.wikia.nocookie.net/overwatch/images/f/fe/Competitive_Silver_Icon.png',
			'gold':        'http://vignette3.wikia.nocookie.net/overwatch/images/4/44/Competitive_Gold_Icon.png',
			'platinum':    'http://vignette2.wikia.nocookie.net/overwatch/images/e/e4/Competitive_Platinum_Icon.png',
			'diamond':     'http://vignette1.wikia.nocookie.net/overwatch/images/3/3f/Competitive_Diamond_Icon.png',
			'master':      'http://vignette2.wikia.nocookie.net/overwatch/images/5/50/Competitive_Master_Icon.png',
			'grandmaster': 'http://vignette2.wikia.nocookie.net/overwatch/images/c/cc/Competitive_Grandmaster_Icon.png'
		};

		//Build the Embed version of the stats display
		const embed = new Discord.RichEmbed()
			.setAuthor(msgStatsContent + '\'s Competitive Information', compIconDict[compOvrStats.tier])
			.setColor(0x00AE86)
			.setTimestamp()
			.setURL()
			.setFooter('© Brought to you by TurboJoe & Sucrizzle')

			.addField('__Competitive Statistics__', ('**Rank:** ' + (compOvrStats.comprank ? compOvrStats.comprank : '-')
																								+ '\n\n**Time Played:** ' + compGmStats.time_played.toLocaleString() + ' hours'
																								+ '\n**Record:** ' + compOvrStats.wins.toLocaleString() + '-' + compOvrStats.losses.toLocaleString() + '-' + compOvrStats.ties.toLocaleString()
																								+ ' (' + compOvrStats.win_rate + '% Win Rate in ' + compOvrStats.games.toLocaleString() + ' games)'
																								+ '\n\n**Voting Cards Earned:** ' + (compGmStats.cards ? compGmStats.cards.toLocaleString() : compGmStats.card ? compGmStats.card.toLocaleString() : '-')
																								+ '\n**Medals Awarded:** ' + (compGmStats.medals ? compGmStats.medals.toLocaleString() : '-')
																								+ ' (G: ' + (compGmStats.medals_gold ? compGmStats.medals_gold.toLocaleString() : '-')
																								+ ' S: ' + (compGmStats.medals_silver ? compGmStats.medals_silver.toLocaleString() : '-')
																								+ ' B: ' + (compGmStats.medals_bronze ? compGmStats.medals_bronze.toLocaleString() : '-') + ')'
																								)
							 )

			.addField('__Eliminations__', '**Average: **' + (compAvgStats.eliminations_avg ? compAvgStats.eliminations_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ ' (' + (compGmStats.kpd ? compGmStats.kpd.toLocaleString() : "-") + 'k/d)'
																+ '\n**Most: **' + (compGmStats.eliminations_most_in_game ? compGmStats.eliminations_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.eliminations ? compGmStats.eliminations.toLocaleString() : '-')
			,true)
			.addField('__Damage__', '**Average: **' + (compAvgStats.damage_done_avg ? compAvgStats.damage_done_avg.toLocaleString('en-US', {maximumFractionDigits: 0}) : '-')
																+ '\n**Most: **' + (compGmStats.damage_done_most_in_game ? compGmStats.damage_done_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.damage_done ? compGmStats.damage_done.toLocaleString() : '-')
			, true)
			.addField('__Healing__', '**Average: **' + (compAvgStats.healing_done_avg ? compAvgStats.healing_done_avg.toLocaleString('en-US', {maximumFractionDigits: 0}) : '-')
																+ '\n**Most: **' + (compGmStats.healing_done_most_in_game ? compGmStats.healing_done_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.healing_done ? compGmStats.healing_done.toLocaleString() : '-')
			, true)
			.addField('__Solo Kills__', '**Average: **' + (compAvgStats.solo_kills_avg ? compAvgStats.solo_kills_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.solo_kills_most_in_game ? compGmStats.solo_kills_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.solo_kills ? compGmStats.solo_kills.toLocaleString() : '-')
			,true)
			.addField('__Final Blows__', '**Average: **' + (compAvgStats.final_blows_avg ? compAvgStats.final_blows_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.final_blows_most_in_game ? compGmStats.final_blows_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.final_blows ? compGmStats.final_blows.toLocaleString() : '-')
			, true)
			.addField('__Melee Kills__', '**Average: **' + (compAvgStats.melee_final_blows_avg ? compAvgStats.melee_final_blows_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : compAvgStats.melee_final_blow_avg ? compAvgStats.melee_final_blow_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : "-")
																+ '\n**Most: **' + (compGmStats.melee_final_blows_most_in_game ? compGmStats.melee_final_blows_most_in_game.toLocaleString() : compGmStats.melee_final_blow_most_in_game ? compGmStats.melee_final_blow_most_in_game.toLocaleString() : "-")
																+ '\n**Total: **' + (compGmStats.melee_final_blows ? compGmStats.melee_final_blows.toLocaleString() : compGmStats.melee_final_blow ? compGmStats.melee_final_blow.toLocaleString() : "-")
			, true)
			.addField('__Objective Kills__', '**Average: **' + (compAvgStats.objective_kills_avg ? compAvgStats.objective_kills_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.objective_kills_most_in_game ? compGmStats.objective_kills_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.objective_kills ? compGmStats.objective_kills.toLocaleString() : '-')
			, true)
			.addField('__Offensive Assists__', '**Average: **' + (compGmStats.offensive_assists ? (compGmStats.offensive_assists / compOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.offensive_assists_most_in_game ? compGmStats.offensive_assists_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.offensive_assists ? compGmStats.offensive_assists.toLocaleString() : '-')
			, true)
			.addField('__Defensive Assists__', '**Average: **' + (compGmStats.defensive_assists ? (compGmStats.defensive_assists / compOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.defensive_assists_most_in_game ? compGmStats.defensive_assists_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.defensive_assists ? compGmStats.defensive_assists.toLocaleString() : '-')
			, true)
			.addField('__Objective Time__', '**Average: **' + (compAvgStats.objective_time_avg ? moment().startOf('day').seconds((compAvgStats.objective_time_avg) * 3600).format('H:mm:ss') : '-')
																+ '\n**Most: **' + (compGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(compGmStats.objective_time_most_in_game * 3600).format('H:mm:ss') : '-')
																+ '\n**Total: **' + (compGmStats.objective_time ? moment().startOf('day').seconds(compGmStats.objective_time * 3600).format('H:mm:ss') : '-')
			, true)
			.addField('__Time on Fire__', '**Average: **' + (compAvgStats.time_spent_on_fire_avg ? moment().startOf('day').seconds((compAvgStats.time_spent_on_fire_avg) * 3600).format('H:mm:ss') : '-')
																+ '\n**Most: **' + (compGmStats.time_spent_on_fire_most_in_game ? moment().startOf('day').seconds(compGmStats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') : '-')
																+ '\n**Total: **' + (compGmStats.time_spent_on_fire ? moment().startOf('day').seconds(compGmStats.time_spent_on_fire * 3600).format('H:mm:ss') : '-')
			, true)
			.addField('__Other Stats__', '**Multikills: **' + (compGmStats.multikills ? compGmStats.multikills.toLocaleString() : '-')
																+ ' (Best Multikill: ' + (compGmStats.multikill_best ? compGmStats.multikill_best.toLocaleString() : '-') + ')'
																+ '\n**Environmental Kills: **' + (compGmStats.environmental_kills ? compGmStats.environmental_kills.toLocaleString() : '-')
																+ '\n**Environmental Deaths:** ' + (compGmStats.environmental_deaths ? compGmStats.environmental_deaths.toLocaleString() : '-')
																+ '\n**Turrets Destroyed:** ' + (compGmStats.turrets_destroyed ? compGmStats.turrets_destroyed.toLocaleString() : '-')
																+ '\n**Teleporters Destroyed:** ' + (compGmStats.teleporter_pads_destroyed ? compGmStats.teleporter_pads_destroyed.toLocaleString() : '-')
																+ '\n**Shield Generators Destroyed:** ' + (compGmStats.shield_generators_destroyed ? compGmStats.shield_generators_destroyed.toLocaleString() : '-')

			);

			// Edit the original response with the embed
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit(message.channel.send({embed}))})
			.catch(console.error);
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

	// Determine what length the command should be for slicing in case a BattleTag is provided and set URL as needed
  const getURLs = (fn1, fn2) => {
	  if (msg.content.startsWith('$compstats')){
		  commLen = 10
	  }

    // Determine if a BattleTag was provided or not
	  if (msg.content.length != commLen){
		  msgStatsContent = msg.content.slice(commLen + 1);
		  contentReplacePoundStats = msgStatsContent.replace('#', '-');
			urls = {
				url: `${apiV3UrlRoot}/u/${contentReplacePoundStats}/stats`,
				headers: {
					'User-Agent': 'CC337'
				}
			}

			// Execute the callback function provided
			fn1(urls, fn2);
	  }
	  else {
		  // Get the BattleTag from the DB
		  const sql = "CALL sp_getPrimaryBTag(?,@output); SELECT @output as bTag;";
		  const options = [msg.author.id.toString()];

      // Execute the query
		  getConnectionRunQuery(dbConnectionPool, sql, options, function(err, results, fields){
			  if(err){
				  console.log(err);
			  }
			  else {
				  msgStatsContent = results[1][0].bTag;
				  contentReplacePoundStats = msgStatsContent.replace('#', '-');
				  urls = {
					  url: `${apiV3UrlRoot}/u/${contentReplacePoundStats}/stats`,
					  headers: {
						  'User-Agent': 'CC337'
					  }
				  }

					// Execute the callback function provided
					fn1(urls, fn2);
			  }
		  });
	  }
  }

	if (msg.content.startsWith('$compstats')) {
		getURLs(request, lookupCorrectFn(getCompUserStats));
		//getURLs(printURLs);
	}
};
/*
	const getCompUserStats = (error, response, parsedBody) => {
		const competitiveData = parsedBody.us.stats.competitive;
		const compGmStats = competitiveData.game_stats;
		const compOvrStats = competitiveData.overall_stats;
		const compAvgStats = competitiveData.average_stats;
		const emptyObjectCompChecker = Object.getOwnPropertyNames(competitiveData);
		if (emptyObjectCompChecker.length === 0 || emptyObjectCompChecker.length === 0) {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("Sorry. This user has missing data. Boo boo doo de doo.");
				});
			return;
		}

		// Make sure the user has played some games this comp Season.  Not sure if it would be null or 0 or ???  Taking a guess here
		if (compOvrStats.games == null || (compOvrStats.games == 0 && compGmStats.games == 0)) {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("You need to play some games first.  Bibbity bobbity boo");
				});
			return;
		}
		// Build links to the comp icons
		const compIconDict = {
			'bronze':      'http://vignette4.wikia.nocookie.net/overwatch/images/8/8f/Competitive_Bronze_Icon.png',
			'silver':      'http://vignette4.wikia.nocookie.net/overwatch/images/f/fe/Competitive_Silver_Icon.png',
			'gold':        'http://vignette3.wikia.nocookie.net/overwatch/images/4/44/Competitive_Gold_Icon.png',
			'platinum':    'http://vignette2.wikia.nocookie.net/overwatch/images/e/e4/Competitive_Platinum_Icon.png',
			'diamond':     'http://vignette1.wikia.nocookie.net/overwatch/images/3/3f/Competitive_Diamond_Icon.png',
			'master':      'http://vignette2.wikia.nocookie.net/overwatch/images/5/50/Competitive_Master_Icon.png',
			'grandmaster': 'http://vignette2.wikia.nocookie.net/overwatch/images/c/cc/Competitive_Grandmaster_Icon.png'
		};

		//Build the Embed version of the stats display
		const embed = new Discord.RichEmbed()
			.setAuthor(msgStatsContent + '\'s Competitive Information', compIconDict[compOvrStats.tier])
			.setColor(0x00AE86)
			.setTimestamp()
			.setURL()
			.setFooter('© Brought to you by TurboJoe & Sucrizzle')

			.addField('__Competitive Statistics__', ('**Rank:** ' + (compOvrStats.comprank ? compOvrStats.comprank : '-')
																								+ '\n\n**Time Played:** ' + compGmStats.time_played.toLocaleString() + ' hours'
																								+ '\n**Record:** ' + compOvrStats.wins.toLocaleString() + '-' + compOvrStats.losses.toLocaleString() + '-' + compOvrStats.ties.toLocaleString()
																								+ ' (' + compOvrStats.win_rate + '% Win Rate in ' + compOvrStats.games.toLocaleString() + ' games)'
																								+ '\n\n**Voting Cards Earned:** ' + (compGmStats.cards ? compGmStats.cards.toLocaleString() : compGmStats.card ? compGmStats.card.toLocaleString() : '-')
																								+ '\n**Medals Awarded:** ' + (compGmStats.medals ? compGmStats.medals.toLocaleString() : '-')
																								+ ' (G: ' + (compGmStats.medals_gold ? compGmStats.medals_gold.toLocaleString() : '-')
																								+ ' S: ' + (compGmStats.medals_silver ? compGmStats.medals_silver.toLocaleString() : '-')
																								+ ' B: ' + (compGmStats.medals_bronze ? compGmStats.medals_bronze.toLocaleString() : '-') + ')'
																								)
							 )

			.addField('__Eliminations__', '**Average: **' + (compAvgStats.eliminations_avg ? compAvgStats.eliminations_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ ' (' + (compGmStats.kpd ? compGmStats.kpd.toLocaleString() : "-") + 'k/d)'
																+ '\n**Most: **' + (compGmStats.eliminations_most_in_game ? compGmStats.eliminations_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.eliminations ? compGmStats.eliminations.toLocaleString() : '-')
			,true)
			.addField('__Damage__', '**Average: **' + (compAvgStats.damage_done_avg ? compAvgStats.damage_done_avg.toLocaleString('en-US', {maximumFractionDigits: 0}) : '-')
																+ '\n**Most: **' + (compGmStats.damage_done_most_in_game ? compGmStats.damage_done_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.damage_done ? compGmStats.damage_done.toLocaleString() : '-')
			, true)
			.addField('__Healing__', '**Average: **' + (compAvgStats.healing_done_avg ? compAvgStats.healing_done_avg.toLocaleString('en-US', {maximumFractionDigits: 0}) : '-')
																+ '\n**Most: **' + (compGmStats.healing_done_most_in_game ? compGmStats.healing_done_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.healing_done ? compGmStats.healing_done.toLocaleString() : '-')
			, true)
			.addField('__Solo Kills__', '**Average: **' + (compAvgStats.solo_kills_avg ? compAvgStats.solo_kills_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.solo_kills_most_in_game ? compGmStats.solo_kills_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.solo_kills ? compGmStats.solo_kills.toLocaleString() : '-')
			,true)
			.addField('__Final Blows__', '**Average: **' + (compAvgStats.final_blows_avg ? compAvgStats.final_blows_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.final_blows_most_in_game ? compGmStats.final_blows_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.final_blows ? compGmStats.final_blows.toLocaleString() : '-')
			, true)
			.addField('__Melee Kills__', '**Average: **' + (compAvgStats.melee_final_blows_avg ? compAvgStats.melee_final_blows_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : compAvgStats.melee_final_blow_avg ? compAvgStats.melee_final_blow_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : "-")
																+ '\n**Most: **' + (compGmStats.melee_final_blows_most_in_game ? compGmStats.melee_final_blows_most_in_game.toLocaleString() : compGmStats.melee_final_blow_most_in_game ? compGmStats.melee_final_blow_most_in_game.toLocaleString() : "-")
																+ '\n**Total: **' + (compGmStats.melee_final_blows ? compGmStats.melee_final_blows.toLocaleString() : compGmStats.melee_final_blow ? compGmStats.melee_final_blow.toLocaleString() : "-")
			, true)
			.addField('__Objective Kills__', '**Average: **' + (compAvgStats.objective_kills_avg ? compAvgStats.objective_kills_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.objective_kills_most_in_game ? compGmStats.objective_kills_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.objective_kills ? compGmStats.objective_kills.toLocaleString() : '-')
			, true)
			.addField('__Offensive Assists__', '**Average: **' + (compGmStats.offensive_assists ? (compGmStats.offensive_assists / compOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.offensive_assists_most_in_game ? compGmStats.offensive_assists_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.offensive_assists ? compGmStats.offensive_assists.toLocaleString() : '-')
			, true)
			.addField('__Defensive Assists__', '**Average: **' + (compGmStats.defensive_assists ? (compGmStats.defensive_assists / compOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
																+ '\n**Most: **' + (compGmStats.defensive_assists_most_in_game ? compGmStats.defensive_assists_most_in_game.toLocaleString() : '-')
																+ '\n**Total: **' + (compGmStats.defensive_assists ? compGmStats.defensive_assists.toLocaleString() : '-')
			, true)
			.addField('__Objective Time__', '**Average: **' + (compAvgStats.objective_time_avg ? moment().startOf('day').seconds((compAvgStats.objective_time_avg) * 3600).format('H:mm:ss') : '-')
																+ '\n**Most: **' + (compGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(compGmStats.objective_time_most_in_game * 3600).format('H:mm:ss') : '-')
																+ '\n**Total: **' + (compGmStats.objective_time ? moment().startOf('day').seconds(compGmStats.objective_time * 3600).format('H:mm:ss') : '-')
			, true)
			.addField('__Time on Fire__', '**Average: **' + (compAvgStats.time_spent_on_fire_avg ? moment().startOf('day').seconds((compAvgStats.time_spent_on_fire_avg) * 3600).format('H:mm:ss') : '-')
																+ '\n**Most: **' + (compGmStats.time_spent_on_fire_most_in_game ? moment().startOf('day').seconds(compGmStats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') : '-')
																+ '\n**Total: **' + (compGmStats.time_spent_on_fire ? moment().startOf('day').seconds(compGmStats.time_spent_on_fire * 3600).format('H:mm:ss') : '-')
			, true)
			.addField('__Other Stats__', '**Multikills: **' + (compGmStats.multikills ? compGmStats.multikills.toLocaleString() : '-')
																+ ' (Best Multikill: ' + (compGmStats.multikill_best ? compGmStats.multikill_best.toLocaleString() : '-') + ')'
																+ '\n**Environmental Kills: **' + (compGmStats.environmental_kills ? compGmStats.environmental_kills.toLocaleString() : '-')
																+ '\n**Environmental Deaths:** ' + (compGmStats.environmental_deaths ? compGmStats.environmental_deaths.toLocaleString() : '-')
																+ '\n**Turrets Destroyed:** ' + (compGmStats.turrets_destroyed ? compGmStats.turrets_destroyed.toLocaleString() : '-')
																+ '\n**Teleporters Destroyed:** ' + (compGmStats.teleporter_pads_destroyed ? compGmStats.teleporter_pads_destroyed.toLocaleString() : '-')
																+ '\n**Shield Generators Destroyed:** ' + (compGmStats.shield_generators_destroyed ? compGmStats.shield_generators_destroyed.toLocaleString() : '-')

			);

			// Edit the original response with the embed
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit(message.channel.send({embed}))})
			.catch(console.error);
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
}

/*
const stats = (msg, msgID, dbConnectionPool) => {

	const msgStatsContent = msg.content.slice(7);
	//const msgCompStatsContent = msg.content.slice(11);
	const msgAvgStatsContent = msg.content.slice(10);
	const contentReplacePoundStats = msgStatsContent.replace('#', '-');
	//const contentReplacePoundCompStats = msgCompStatsContent.replace('#', '-');
	const contentReplacePoundAvgStats = msgAvgStatsContent.replace('#', '-');

  // Setup the ability to pull from the database if needed
  const sql = "CALL sp_getPrimaryBTag(?,@output); SELECT @output as bTag;";
  var msgCompStatsContent = '';
	var contentReplacePoundCompStats = '';

	if (msg.content.startsWith('$stats')) {

	}
	else if (msg.content.startsWith('$compstats')) {
		// If the message does not contain a BattleTag, pull from database
		if (msg.content.length == 10){
			// Get the discordId
      const options = [msg.author.id.toString()];

			// Get a conneciton from the pool
			dbConnectionPool.getConnection((err, connection) => {
        if (err) {
					return callback(err,null);
				}
        else if (connection){
				  // Execute the query
				  connection.query(sql, options, (error, results, fields) => {
					  if (error) throw error;
					  msg.reply("Query executed check console");
					  console.log(results);
					  msgCompStatsContent = results[1][0].bTag;
					  contentReplacePoundCompStats = msgCompStatsContent.replace('#', '-');
					  console.log(contentReplacePoundCompStats);
				  });
				  connection.release();
					if (err) {
                return callback(err, null);
            }
            return callback(null, results);
			  }
				else {
					return callback(true, 'No Connection');
				}
			});
		}
		// If the message contains a BatteTag parse it out
		else{
			msgCompStatsContent = msg.content.slice(11);
			contentReplacePoundCompStats = msgCompStatsContent.replace('#', '-');
		}
	}
	else if (msg.content.startsWith('$avgstats')) {

	}

  console.log(contentReplacePoundCompStats);

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

  console.log(urls);

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
		//Build the Embed version of the stats display
		const embed = new Discord.RichEmbed()
			.setAuthor(msgStatsContent + '\'s Quick Play Information', QPOvrStats.avatar)
			.setColor(0x00AE86)
			.setTimestamp()
			.setURL()
			.setFooter('© Brought to you by TurboJoe & Sucrizzle')
			.addField('__Quick Play Statistics__', ('**Level:** ' + (QPOvrStats.prestige !== 0 ? QPOvrStats.prestige : '') + QPOvrStats.level
                                                + '\n\n**Time Played:** ' + QPGmStats.time_played.toLocaleString() + ' hours'
                                                + '\n**Record:** ' + QPOvrStats.wins.toLocaleString() + '-' + QPOvrStats.losses.toLocaleString()
                                                + ' (' + QPOvrStats.win_rate + '% Win Rate in ' + QPOvrStats.games.toLocaleString() + ' games)'
                                                + '\n\n**Voting Cards Earned:** ' + (QPGmStats.cards ? QPGmStats.cards.toLocaleString() : QPGmStats.card ? QPGmStats.card.toLocaleString() : '-')
                                                + '\n**Medals Awarded:** ' + (QPGmStats.medals ? QPGmStats.medals.toLocaleString() : '-')
                                                + ' (G: ' + QPGmStats.medals_gold ? QPGmStats.medals_gold.toLocaleString() : '-'
																								+ ' S: ' + QPGmStats.medals_silver ? QPGmStats.medals_silver.toLocaleString() : '-'
																								+ ' B: ' + QPGmStats.medals_bronze ? QPGmStats.medals_bronze.toLocaleString() : '-' + ')'
																							  )
							 )
			.addField('__Eliminations__', '**Average: **' + (QPGmStats.eliminations ? (QPGmStats.eliminations / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
                                + ' (' + (QPGmStats.kpd ? QPGmStats.kpd.toLocaleString() : "-") + 'k/d)'
                                + '\n**Most: **' + (QPGmStats.eliminations_most_in_game ? QPGmStats.eliminations_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (QPGmStats.eliminations ? QPGmStats.eliminations.toLocaleString() : '-')
			,true)
			.addField('__Damage__', '**Average: **' + (QPGmStats.damage_done ? (QPGmStats.damage_done / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 0}) : '-')
                                + '\n**Most: **' + (QPGmStats.damage_done_most_in_game ? QPGmStats.damage_done_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (QPGmStats.damage_done ? QPGmStats.damage_done.toLocaleString() : '-')
			, true)
			.addField('__Healing__', '**Average: **' + (QPGmStats.healing_done ? (QPGmStats.healing_done / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 0}) : '-')
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
			.addField('__Objective Kills__', '**Average: **' + (QPGmStats.objective_kills ? (QPGmStats.objective_kills / QPOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
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
			);

			// Edit the original response with the embed
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit(message.channel.send({embed}))})
			.catch(console.error);
		}

	const getCompUserStats = (error, response, parsedBody) => {
		const competitiveData = parsedBody.us.stats.competitive;
		const compGmStats = competitiveData.game_stats;
		const compOvrStats = competitiveData.overall_stats;
		const compAvgStats = competitiveData.average_stats;
		const emptyObjectCompChecker = Object.getOwnPropertyNames(competitiveData);
		if (emptyObjectCompChecker.length === 0 || emptyObjectCompChecker.length === 0) {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("Sorry. This user has missing data. Boo boo doo de doo.");
				});
			return;
		}

		// Make sure the user has played some games this comp Season.  Not sure if it would be null or 0 or ???  Taking a guess here
		if (compOvrStats.games == null || (compOvrStats.games == 0 && compGmStats.games == 0)) {
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit("You need to play some games first.  Bibbity bobbity boo");
				});
			return;
		}
		// Build links to the comp icons
		const compIconDict = {
			'bronze':      'http://vignette4.wikia.nocookie.net/overwatch/images/8/8f/Competitive_Bronze_Icon.png',
			'silver':      'http://vignette4.wikia.nocookie.net/overwatch/images/f/fe/Competitive_Silver_Icon.png',
			'gold':        'http://vignette3.wikia.nocookie.net/overwatch/images/4/44/Competitive_Gold_Icon.png',
			'platinum':    'http://vignette2.wikia.nocookie.net/overwatch/images/e/e4/Competitive_Platinum_Icon.png',
			'diamond':     'http://vignette1.wikia.nocookie.net/overwatch/images/3/3f/Competitive_Diamond_Icon.png',
			'master':      'http://vignette2.wikia.nocookie.net/overwatch/images/5/50/Competitive_Master_Icon.png',
			'grandmaster': 'http://vignette2.wikia.nocookie.net/overwatch/images/c/cc/Competitive_Grandmaster_Icon.png'
		};

		//Build the Embed version of the stats display
		const embed = new Discord.RichEmbed()
			.setAuthor(msgCompStatsContent + '\'s Competitive Information', compIconDict[compOvrStats.tier])
			.setColor(0x00AE86)
			.setTimestamp()
			.setURL()
			.setFooter('© Brought to you by TurboJoe & Sucrizzle')

			.addField('__Competitive Statistics__', ('**Rank:** ' + (compOvrStats.comprank ? compOvrStats.comprank : '-')
                                                + '\n\n**Time Played:** ' + compGmStats.time_played.toLocaleString() + ' hours'
                                                + '\n**Record:** ' + compOvrStats.wins.toLocaleString() + '-' + compOvrStats.losses.toLocaleString() + '-' + compOvrStats.ties.toLocaleString()
                                                + ' (' + compOvrStats.win_rate + '% Win Rate in ' + compOvrStats.games.toLocaleString() + ' games)'
                                                + '\n\n**Voting Cards Earned:** ' + (compGmStats.cards ? compGmStats.cards.toLocaleString() : compGmStats.card ? compGmStats.card.toLocaleString() : '-')
                                                + '\n**Medals Awarded:** ' + (compGmStats.medals ? compGmStats.medals.toLocaleString() : '-')
                                                + ' (G: ' + (compGmStats.medals_gold ? compGmStats.medals_gold.toLocaleString() : '-')
																								+ ' S: ' + (compGmStats.medals_silver ? compGmStats.medals_silver.toLocaleString() : '-')
																								+ ' B: ' + (compGmStats.medals_bronze ? compGmStats.medals_bronze.toLocaleString() : '-') + ')'
                                                )
							 )

			.addField('__Eliminations__', '**Average: **' + (compAvgStats.eliminations_avg ? compAvgStats.eliminations_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
                                + ' (' + (compGmStats.kpd ? compGmStats.kpd.toLocaleString() : "-") + 'k/d)'
                                + '\n**Most: **' + (compGmStats.eliminations_most_in_game ? compGmStats.eliminations_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (compGmStats.eliminations ? compGmStats.eliminations.toLocaleString() : '-')
			,true)
			.addField('__Damage__', '**Average: **' + (compAvgStats.damage_done_avg ? compAvgStats.damage_done_avg.toLocaleString('en-US', {maximumFractionDigits: 0}) : '-')
                                + '\n**Most: **' + (compGmStats.damage_done_most_in_game ? compGmStats.damage_done_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (compGmStats.damage_done ? compGmStats.damage_done.toLocaleString() : '-')
			, true)
			.addField('__Healing__', '**Average: **' + (compAvgStats.healing_done_avg ? compAvgStats.healing_done_avg.toLocaleString('en-US', {maximumFractionDigits: 0}) : '-')
                                + '\n**Most: **' + (compGmStats.healing_done_most_in_game ? compGmStats.healing_done_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (compGmStats.healing_done ? compGmStats.healing_done.toLocaleString() : '-')
			, true)
			.addField('__Solo Kills__', '**Average: **' + (compAvgStats.solo_kills_avg ? compAvgStats.solo_kills_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
                                + '\n**Most: **' + (compGmStats.solo_kills_most_in_game ? compGmStats.solo_kills_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (compGmStats.solo_kills ? compGmStats.solo_kills.toLocaleString() : '-')
			,true)
			.addField('__Final Blows__', '**Average: **' + (compAvgStats.final_blows_avg ? compAvgStats.final_blows_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
                                + '\n**Most: **' + (compGmStats.final_blows_most_in_game ? compGmStats.final_blows_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (compGmStats.final_blows ? compGmStats.final_blows.toLocaleString() : '-')
			, true)
			.addField('__Melee Kills__', '**Average: **' + (compAvgStats.melee_final_blows_avg ? compAvgStats.melee_final_blows_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : compAvgStats.melee_final_blow_avg ? compAvgStats.melee_final_blow_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : "-")
                                + '\n**Most: **' + (compGmStats.melee_final_blows_most_in_game ? compGmStats.melee_final_blows_most_in_game.toLocaleString() : compGmStats.melee_final_blow_most_in_game ? compGmStats.melee_final_blow_most_in_game.toLocaleString() : "-")
                                + '\n**Total: **' + (compGmStats.melee_final_blows ? compGmStats.melee_final_blows.toLocaleString() : compGmStats.melee_final_blow ? compGmStats.melee_final_blow.toLocaleString() : "-")
			, true)
			.addField('__Objective Kills__', '**Average: **' + (compAvgStats.objective_kills_avg ? compAvgStats.objective_kills_avg.toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
                                + '\n**Most: **' + (compGmStats.objective_kills_most_in_game ? compGmStats.objective_kills_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (compGmStats.objective_kills ? compGmStats.objective_kills.toLocaleString() : '-')
			, true)
			.addField('__Offensive Assists__', '**Average: **' + (compGmStats.offensive_assists ? (compGmStats.offensive_assists / compOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
                                + '\n**Most: **' + (compGmStats.offensive_assists_most_in_game ? compGmStats.offensive_assists_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (compGmStats.offensive_assists ? compGmStats.offensive_assists.toLocaleString() : '-')
			, true)
			.addField('__Defensive Assists__', '**Average: **' + (compGmStats.defensive_assists ? (compGmStats.defensive_assists / compOvrStats.games).toLocaleString('en-US', {maximumFractionDigits: 2}) : '-')
                                + '\n**Most: **' + (compGmStats.defensive_assists_most_in_game ? compGmStats.defensive_assists_most_in_game.toLocaleString() : '-')
                                + '\n**Total: **' + (compGmStats.defensive_assists ? compGmStats.defensive_assists.toLocaleString() : '-')
			, true)
			.addField('__Objective Time__', '**Average: **' + (compAvgStats.objective_time_avg ? moment().startOf('day').seconds((compAvgStats.objective_time_avg) * 3600).format('H:mm:ss') : '-')
                                + '\n**Most: **' + (compGmStats.objective_time_most_in_game ? moment().startOf('day').seconds(compGmStats.objective_time_most_in_game * 3600).format('H:mm:ss') : '-')
                                + '\n**Total: **' + (compGmStats.objective_time ? moment().startOf('day').seconds(compGmStats.objective_time * 3600).format('H:mm:ss') : '-')
			, true)
			.addField('__Time on Fire__', '**Average: **' + (compAvgStats.time_spent_on_fire_avg ? moment().startOf('day').seconds((compAvgStats.time_spent_on_fire_avg) * 3600).format('H:mm:ss') : '-')
                                + '\n**Most: **' + (compGmStats.time_spent_on_fire_most_in_game ? moment().startOf('day').seconds(compGmStats.time_spent_on_fire_most_in_game * 3600).format('H:mm:ss') : '-')
                                + '\n**Total: **' + (compGmStats.time_spent_on_fire ? moment().startOf('day').seconds(compGmStats.time_spent_on_fire * 3600).format('H:mm:ss') : '-')
			, true)
			.addField('__Other Stats__', '**Multikills: **' + (compGmStats.multikills ? compGmStats.multikills.toLocaleString() : '-')
                                + ' (Best Multikill: ' + (compGmStats.multikill_best ? compGmStats.multikill_best.toLocaleString() : '-') + ')'
                                + '\n**Environmental Kills: **' + (compGmStats.environmental_kills ? compGmStats.environmental_kills.toLocaleString() : '-')
                                + '\n**Environmental Deaths:** ' + (compGmStats.environmental_deaths ? compGmStats.environmental_deaths.toLocaleString() : '-')
                                + '\n**Turrets Destroyed:** ' + (compGmStats.turrets_destroyed ? compGmStats.turrets_destroyed.toLocaleString() : '-')
                                + '\n**Teleporters Destroyed:** ' + (compGmStats.teleporter_pads_destroyed ? compGmStats.teleporter_pads_destroyed.toLocaleString() : '-')
                                + '\n**Shield Generators Destroyed:** ' + (compGmStats.shield_generators_destroyed ? compGmStats.shield_generators_destroyed.toLocaleString() : '-')

			);

			// Edit the original response with the embed
			msg.channel.fetchMessage(msgID)
				.then(message => {
					message.edit(message.channel.send({embed}))})
			.catch(console.error);
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
*/
module.exports = stats;
