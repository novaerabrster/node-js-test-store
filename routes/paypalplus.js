var express = require('express');
var router = express.Router();

var PayPalPlusController = require('../controllers/PayPalPlusController.js');

router.get('/', PayPalPlusController.init);
router.post('/executePayment', PayPalPlusController.executePayment)
router.post('/disputecreated', PayPalPlusController.disputeCreated)

module.exports = router;
