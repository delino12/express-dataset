var express 	= require('express');
var controller 	= require('../controllers/events');
var router 		= express.Router();

// web route uri
router.delete('/', controller.eraseEvents);

module.exports = router;