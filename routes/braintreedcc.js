var express = require('express');
var router = express.Router();

var BraintreeDCCController = require('../controllers/BraintreeDCCController.js');

router.get('/', BraintreeDCCController.init);
router.post('/addCard', BraintreeDCCController.addCard);
router.post('/pay', BraintreeDCCController.pay);

module.exports = router;