const getConnectionRunQuery = (dbConnectionPool, whatQuery, options) => {

  switch(whatQuery) {

      case 'setDb':
        dbConnectionPool.getConnection((err, connection) => {
          connection.query('CREATE TABLE Members(MemberID VARCHAR(50), DiscordID VARCHAR(45), DiscordNickname VARCHAR(45), DateAdded DATE, BattleTagID VARCHAR(45), PRIMARY KEY (MemberID))',
            (error, results, fields) => {
              if (error) throw error;
              console.log(error, results);
            });
          connection.release();
        });
        break;

        case 'setBattleTag':
          const escapedBattleTagData = {
            MemberID: options.uuid,
            DiscordID: options.discordId,
            DiscordNickname: null,
            DateAdded: new Date(),
            BattleTagID: options.battleTag
          };
          console.log(options);
          dbConnectionPool.getConnection((err, connection) => {
            connection.query('INSERT INTO Members SET ?', escapedBattleTagData, (error, results, fields) => {
              if (error) throw error;
              console.log(error, results);
            });
            connection.release();
          });
          break;
  }

};

module.exports = getConnectionRunQuery;
