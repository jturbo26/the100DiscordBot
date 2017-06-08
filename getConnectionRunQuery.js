const getConnectionRunQuery = (dbConnectionPool, whatQuery) => {

  switch(whatQuery) {

    case 'increaseCount':
      dbConnectionPool.getConnection((err, connection) => {
        connection.query('UPDATE members SET count = count+1 where memberId = 123456', (error, results, fields) => {
          if (error) throw error;
          console.log(error, results);
        });
        connection.release();
      });
      break;

      case 'games':
        console.log('Games inside getConnectionRunQuery');
  }

};

module.exports = getConnectionRunQuery;
