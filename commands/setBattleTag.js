const getConnectionRunQuery = require('../utils/getConnectionRunQuery.js')
const getBattleTag = require('../commands/getBattleTag.js');

const setBattleTag = (msg, dbConnectionPool) => {
	// Set the options needed for the Stored Proc
  const battleTag = msg.content.slice(14).toString();
	const discordId = msg.author.id.toString();
	const discordUser = msg.author.username.toString();

  // Build a single list of options & set the SQL call
	const options = [discordId, discordUser, battleTag];
  const sql = 'CALL sp_bTagReg(?,?,?)';

  // Call the common query running function
  getConnectionRunQuery(dbConnectionPool, sql, options, function(err, results, fields){
    if(err){
      console.log(err);
    }
    else {
      getBattleTag(msg,dbConnectionPool);
    }
  });
};

module.exports = setBattleTag;
