const request = require('request');

const getRandomNumber = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

const popcornGif = msg => {
	const getGif = (error, response, body) => {
		if(!error && response.statusCode === 200) {
			const jsonResponse = JSON.parse(body);
			const responseRandomNumber = getRandomNumber(0,23);
			msg.channel.send(jsonResponse.data[responseRandomNumber].url);
		}
	}
request('http://api.giphy.com/v1/gifs/search?q=popcorn&api_key=dc6zaTOxFJmzC', getGif);
}

module.exports = popcornGif;
