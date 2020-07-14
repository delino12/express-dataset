const path 		= require('path')
const sqlite3 	= require('sqlite3').verbose();
const db_path   = `./test.sqlite`;

// note: test.db is in the same directory as connection
// create connection chain
let db = new sqlite3.Database(db_path, (err) => {
	if (err) {
		console.error(err.message);
		console.log(`Error connecting to database => ${db}`);
	}else{
		console.log(`Connected to the database => ${db}`);
	}
});

module.exports = db;