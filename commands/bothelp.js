const botHelpResponses = {
  things: 'Here are the things you can do with this bot: \n',
  the100status: '\n $my100status <insert gamertag here> will display The100 site stats for the user you insert in the arrows.',
  playingNow: '\n $playingnow will show you everyone who wants to group up from the100.io. If nobody shows up, be sure to set your status on the site.',
  games: '\n $games will display a list of games that are going on today along with a little information'
};

const botHelp = (msg, bot) => {
  console.log('$botHelp was used');
  bot.reply(msg, botHelpResponses.things + botHelpResponses.the100status + botHelpResponses.playingNow + botHelpResponses.games);
}

module.exports = botHelp;
