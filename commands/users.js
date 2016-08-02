const request = require('request');

const the100UserUrl = 'https://www.the100.io/api/v1/groups/3140/users/';

const userStatus = (msg, bot) {
  const userName = msg.content.split(' ').pop();
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
        return gamer.gamertag == 'Wannahotchic';
      });
      console.log(requestedUser[0], requestedUser[0].gamertag, requestedUser[0].activity_score);
    }
    else {
      console.log("Sorry there was an error!");
    }
  };
  request(userAuthOptions, getUserStatus);
}

module.exports = userStatus;
