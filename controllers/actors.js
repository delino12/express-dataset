const Actor = require('../models/actor');

var fetchAll = async (req, res) => {
	await Actor.getAllActors(req, res);
	
	res.status(200).json(actors);
}


module.exports = {
	fetchAll: fetchAll
}