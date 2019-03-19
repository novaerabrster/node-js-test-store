var express = require('express');
var router = express.Router();

var UtilsController = require('../controllers/UtilsController.js');

router.post('/inspectpayload', UtilsController.inspectPayload);

module.exports = router;