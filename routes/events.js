var express 	= require('express');
var controller 	= require('../controllers/events');
var router 		= express.Router();

// web route uri
router.get('/', controller.getAllEvents);
router.post('/', controller.addEvent);

module.exports = router;