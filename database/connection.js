const path 		= require('path')
const sqlite3 	= require('sqlite3').verbose();
const db_path   = path.resolve(__dirname, 'test.sqlite')

// note: test.db is in the same directory as connection
// create connection chain
let db = new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
		console.log('Error connecting to database => test.sqlite');
	}else{
		console.log('Connected to the database => test.sqlite');
	}
});

module.exports = db;