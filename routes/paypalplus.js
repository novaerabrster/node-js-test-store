var express = require('express');
var router = express.Router();

router.get('/createpayment', (req, res) => {
    res.render('layout', {
        title: 'NodeJS Test Store',
        content: 'sample'
    }); 
});

module.exports = router;