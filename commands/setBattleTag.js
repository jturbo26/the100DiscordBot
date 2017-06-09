const getConnectionRunQuery = require('../utils/getConnectionRunQuery.js');
const getUuid = require('../utils/getUuid.js');

const setBattleTag = (msg, dbConnectionPool) => {
	const battleTag = msg.content.slice(14).toString();
	const discordId = msg.author.id.toString();
	const uuid = getUuid();

	const options = {
		uuid,
		battleTag,
		discordId,
	}

	getConnectionRunQuery(dbConnectionPool, 'setBattleTag', options);

}

module.exports = setBattleTag;
