const getConnectionRunQuery = require('../utils/getConnectionRunQuery.js')

const getBattleTag = (msg, dbConnectionPool) => {
	// Set the options needed for the Stored Proc
	const discordId = msg.author.id.toString();

  // Build a single list of options & set the SQL call
	const options = [discordId];
  const sql = "CALL sp_getPrimaryBTag(?,@output); SELECT @output as bTag;";

  // Call the common query running function
  getConnectionRunQuery(dbConnectionPool, sql, options, function(err, results, fields){
    if(err){
      console.log(err);
    }
    else {
      msg.reply('your BattleTag is set to ' + results[1][0].bTag);
    }
  });
};

module.exports = getBattleTag;
