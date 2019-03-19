var express = require('express');
var router = express.Router();

var MessengerController = require('../controllers/MessengerController.js');

router.get('/', MessengerController.init);

module.exports = router;