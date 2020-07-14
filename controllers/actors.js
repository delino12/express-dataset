const Actor = require('../models/actor');

var fetchAll = async (req, res) => {
	await Actor.getAllActors(req, res);
}

var updateActorProfile = async (req, res) => {
	await Actor.updateActorProfile(req, res);
}

var getActorStreak = async (req, res) => {
	await Actor.getActorStreak(req, res);
}

module.exports = {
	fetchAll: fetchAll,
	updateActorProfile: updateActorProfile,
	getActorStreak: getActorStreak
}