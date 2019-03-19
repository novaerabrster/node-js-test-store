var express = require('express');
var router = express.Router();

var PayoutsController = require('../controllers/PayoutsController.js');

router.get('/', PayoutsController.init);
router.post('/executepauouts', PayoutsController.executePayouts);
router.post('/getbatchpayouts', PayoutsController.getBatchPayouts);

module.exports = router;