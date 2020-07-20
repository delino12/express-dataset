var db = require('./connection');

var eventSchema = `
	CREATE TABLE IF NOT EXISTS events (
		id INT PRIMARY KEY, 
		type TEXT, 
		actor INT, 
		repo INT, 
		created_at TEXT, 
		FOREIGN KEY (actor) REFERENCES actors (id) 
		FOREIGN KEY (repo) REFERENCES repositories (id) 
	)
`;
db.run(eventSchema, function(err, val) {
	if(err) console.log(err);
	else console.log('Event table is ready!');
});

var actorSchema = `
	CREATE TABLE IF NOT EXISTS actors (
		id INT PRIMARY KEY,
		login TEXT, 
		avatar_url TEXT
	)
`;
db.run(actorSchema, function(err, val) {
	if(err) reject(err);
	else console.log('Actors table is ready!');
});

var repoSchema = `
	CREATE TABLE IF NOT EXISTS repositories (
		id INT PRIMARY KEY, 
		name TEXT, 
		url TEXT
	)
`;
db.run(repoSchema, function(err, val) {
	if(err) reject(err);
	else console.log('Repositories table is ready!');
});