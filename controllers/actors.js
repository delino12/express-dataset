const Actor = require('../models/actor');

var fetchAll = async (req, res) => {
	await Actor.getAllActors(req, res);
	
	res.status(200).json(actors);
}

var updateActorProfile = async (req, res) => {
	await Actor.updateActorProfile(req, res);
	
	res.status(200).json(actors);
}

var getActorStreak = async (req, res) => {
	await Actor.getActorStreak(req, res);
	
	res.status(200).json(actors);
}

module.exports = {
	fetchAll: fetchAll,
	updateActorProfile: updateActorProfile,
	getActorStreak: getActorStreak
}