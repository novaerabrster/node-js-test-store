var express = require('express');
var router = express.Router();

var ReferenceTransactionController = require('../controllers/ReferenceTransactionController.js');

router.get('/', ReferenceTransactionController.init);
router.post('/setexpresscheckout', ReferenceTransactionController.setExpressCheckout);
router.post('/createbillingagreement', ReferenceTransactionController.createBillingAgreement);
router.post('/calculatefinancingoptions', ReferenceTransactionController.calculateFinancingOptions);
router.post('/createpayment', ReferenceTransactionController.createPayment)

module.exports = router;