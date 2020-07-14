const events = require('../models/event');

var getAllEvents = async (req, res) => {
	await events.getAll(req, res);
};

var addEvent = async (req, res) => {
	await events.addToEvent(req, res);
};

var getByActor = async (req, res) => {
	await events.byActor(req, res);
};

var eraseEvents = async (req, res) => {
	await events.delAllEvent(req, res);
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};

















