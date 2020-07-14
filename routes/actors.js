var express 	= require('express');
var controller 	= require('../controllers/actors');
var router 		= express.Router();

// web route uri
router.get('/', controller.fetchAll);
router.put('/:actorId', controller.updateActorProfile);
router.get('/streak', controller.getActorStreak);

module.exports = router;