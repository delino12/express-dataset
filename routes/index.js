var express 	= require('express');
var controller 	= require('../controllers/index');
var router 		= express.Router();

// web route uri
router.get('/', controller.index);

module.exports = router;