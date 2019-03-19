var express = require('express');
var router = express.Router();

var ExpressCheckoutController = require('../controllers/ExpressCheckoutController.js');

router.get('/', ExpressCheckoutController.init);
router.post('/createpayment', ExpressCheckoutController.createPayment);
router.post('/detailPayment', ExpressCheckoutController.detailPayment );
router.post('/executepayment', ExpressCheckoutController.executePayment);
router.post('/capturePayment', ExpressCheckoutController.capturePayment);

module.exports = router;