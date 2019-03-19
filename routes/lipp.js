var express = require('express');
var router = express.Router();

var LIPPController = require('../controllers/LIPPController.js');

router.get('/', LIPPController.init);
router.get('/login', LIPPController.login);

module.exports = router;