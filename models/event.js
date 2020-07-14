const db = require('../database/connection');

// add new event
exports.addToEvent = async (req, res) => {
	const alreadyAddedEvent = await getOneEvent(req.body.id).then(val => val).catch(err => console.log(err));
	if(alreadyAddedEvent.length > 0){
		res.status(400).send();
	}else{
		// insert into repo and actors
		await saveNewEvent(req).then(val => {
			// console.log(val)
		}).catch(err => console.log(err));
		
		await addToActor(req).then(val => {
			// console.log(val)
		}).catch(err => console.log(err));
		await addToRepo(req).then(val => {
			// console.log(val)
		}).catch(err => console.log(err));

		res.status(201).send();
	}
}

// get all event
exports.getAll = async (req, res) => {
	// fetch all event
	const events = await getAllEVents().then(events => events).catch(err => console.log(err));
	const allEvents = [];
	const event = {}
	for(var i = 0; i < events.length; i++){
		event.actor = await getActor(events[i].actor).then(actor => actor[0]).catch(err => console.log(err));
		event.repo = await getRepository(events[i].repo).then(repo => repo[0]).catch(err => console.log(err));
		event.id = events[i].id;
		event.created_at = events[i].created_at;
		event.type = events[i].type;

		allEvents.push(event);
	}

	if(allEvents.length > 0){
		res.status(200).send(allEvents);
	}else{
		res.status(200).send(allEvents);
	}
}

// fetch event by actor id
exports.byActor = async (req, res) => {
	// fetch event by actor ID
	const events = await getAllEVentsByActorID(req.params.actorId).then(events => events).catch(err => console.log(err));
	const allEvents = [];
	const event = {}
	for(var i = 0; i < events.length; i++){
		event.actor = await getActor(events[i].actor).then(actor => actor[0]).catch(err => console.log(err));
		event.repo = await getRepository(events[i].repo).then(repo => repo[0]).catch(err => console.log(err));
		event.id = events[i].id;
		event.created_at = events[i].created_at;
		event.type = events[i].type;

		allEvents.push(event);
	}

	if(allEvents.length > 0){
		res.status(200).send(allEvents);
	}else{
		res.status(404).send(allEvents);
	}
}

// delete or erase all event
exports.delAllEvent = async (req, res) => {
	// delete all events
	await resolveDelete().then(val => {
		res.status(200).send();
	});
}

// resolve actor information
function getActor (actorID) {
	return new Promise((resolve, reject) => {
		db.all(`SELECT id, login, avatar_url FROM actors WHERE id = ${actorID}`, (err, actor) => {
			if(err) reject(err);
			resolve(actor);
		});
	});
}

// resolve actor information
function getRepository (repoID) {
	return new Promise((resolve, reject) => {
		db.all(`SELECT id, name, url FROM repositories WHERE id = ${repoID}`, (err, repo) => {
			if(err) reject(err);
			resolve(repo);
		});
	});
}

// resolve events
function getOneEvent(eventId) {
	return new Promise((resolve, reject) => {
		db.all(`SELECT * FROM events WHERE id = ${eventId}`, (err, val) => {
			// console log data
			if(val) resolve(val)
			if(err) reject(err)
		})
	})
}

function saveNewEvent(req) {
	return new Promise((resolve, reject) => {
		// record new event 
		db.run(`INSERT INTO events(id, type, actor, repo, created_at) VALUES(?, ?, ?, ?, ?)`, [req.body.id, req.body.type, req.body.actor.id, req.body.repo.id, req.body.created_at], (err, val) => {
			// console.log(val);
			if(err) reject(err);
			resolve(true);
		});
	});
}

function addToActor(req) {
	return new Promise((resolve, reject) => {
		// insert user
		db.run(`SELECT * FROM actors WHERE id = ${req.body.actor.id}`, (err, val) => {
			// console.log(val);
			if(err) reject(err);
			if(!val){
				// store actor details
				db.run(`INSERT INTO actors(id, login, avatar_url) VALUES(?, ?, ?)`, [req.body.actor.id, req.body.actor.login, req.body.actor.avatar_url], (err, val) => {
					resolve(true);
				});
			}
		});
		
	});
}

function addToRepo(req) {
	return new Promise((resolve, reject) => {
		// insert to repository
		db.run(`SELECT * FROM repositories WHERE id = ${req.body.repo.id}`, (err, val) => {
			if(err) reject(err);
			if(!val){
				// store actor details
				db.run(`INSERT INTO repositories(id, name, url) VALUES(?, ?, ?)`, [req.body.repo.id, req.body.repo.name, req.body.repo.url], (err, val) => {
					resolve(true);
				});
			}
		});
	});
}

// resolve events
function getAllEVents() {
	return new Promise((resolve, reject) => {
		db.all(`SELECT id, type, actor, repo, created_at FROM events ORDER BY id ASC`, (err, events) => {
			if(err) reject(err);
			resolve(events);
		});
	});
}

// resolve events by actor id
function getAllEVentsByActorID(actorID) {
	return new Promise((resolve, reject) => {
		db.all(`SELECT id, type, actor, repo, created_at FROM events WHERE actor = ${actorID} ORDER BY id ASC`, (err, events) => {
			if(err) reject(err);
			resolve(events);
		});
	});
}

// resolve delete
function resolveDelete() {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.all(`DELETE FROM events`, (err) => {
				if(err) reject(false)
				db.all(`DELETE FROM repositories`, (err) => {
					if(err) reject(false)
					db.all(`DELETE FROM actors`, (err) => {
						if(err) reject(false)
						resolve(true);
					});
				});
			});
		});
	});
}
