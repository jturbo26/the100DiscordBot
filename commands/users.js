const request = require('request');

const authDetails = require('../auth.json');
const the100UserUrl = 'https://www.the100.io/api/v1/groups/3140/users?page=all';

const userStatus = (msg, bot) => {
  const userName = msg.content.split(' ').pop();
  const lcUserName = userName.toLowerCase();
  const userAuthOptions = {
    url: the100UserUrl,
    headers: {
      'Authorization': authDetails.the100token
    }
  };
  const getUserStatus = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const usersJson = JSON.parse(body);
      const requestedUser = usersJson.filter(gamer => {
        return gamer.gamertag.toLowerCase() == lcUserName;
      });
      const gamer = requestedUser[0];
      if(gamer === undefined) {
        bot.reply(msg, 'Sorry, no user was found by that name. Please try again with a different username.')
      }
      else {
        bot.reply(msg, gamer.gamertag + ' has ' +
        gamer.activity_score + ' activity points and ' + gamer.karmas_count + ' karma on the site!');
      }
    }
    else {
      console.log("Sorry there was an error!");
    }
  };
  request(userAuthOptions, getUserStatus);
}

module.exports = userStatus;
