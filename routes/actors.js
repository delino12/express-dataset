var express 	= require('express');
var controller 	= require('../controllers/actors');
var router 		= express.Router();

// web route uri
router.get('/', controller.fetchAll);
// router.get('/:actor_id', controller.fetchOne);
// router.post('/', controller.addOne);
// router.delete('/', controller.deleteAll);

module.exports = router;