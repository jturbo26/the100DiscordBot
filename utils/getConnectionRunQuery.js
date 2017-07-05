const getConnectionRunQuery = (dbConnectionPool, whatQuery, options, callback) => {

	// Pull a connection and make the call
	dbConnectionPool.getConnection((err, connection) => {
		if (err){
			console.log('No Connection');
			callback(err, null, null);
		}
		else{
		  connection.query(whatQuery, options, (error, results, fields) => {
			  if (error) {
					console.log(error);
					callback(error, null, null);
				}
				else{
					console.log('Executing: ' + whatQuery);
					console.log('with options: ' + options)
					callback(null, results, fields);
				}
		  });
		  connection.release();
	 }
 	});
};

module.exports = getConnectionRunQuery;
