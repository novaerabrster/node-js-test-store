const oauth = require('../helpers/AuthorizationHelper.js');
const rp = require('request-promise');

var title = 'Payouts'

module.exports = {
    
    init: (req, res) => {
        res.render('layout', {
            title: title,
            content: 'payouts/form'
        });
    },
    
    executePayouts: (req, res) => {
        let request = req.body;
        
        let payload = {
            sender_batch_header: {
                sender_batch_id: request.senderBatchId,
                email_subject: request.emailSubject,
            },
            items: [{
                recipient_type: request.recipientType,
                amount: {
                    value: request.value,
                    currency: request.currency
                },
                note: request.note,
                sender_item_id: request.senderItemId,
                receiver: request.receiver
            }]
        };
        console.log(JSON.stringify(payload));
        let options = {
            url: 'https://api.sandbox.paypal.com/v1/payments/payouts',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer '+ oauth.getAccessToken()
            },
            method: 'POST',
            json: true,
            body: payload
        };
        
        rp(options)
        .then((response) => {
            console.log(response)
            res.render('layout', {
                title: title,
                content: 'payouts/payoutsresult',
                response: response
            });
        })
        .catch((error) => {
            console.log(error.body);
            throw new Error(error);
        })
    },
    
    getBatchPayouts: (req, res) => {
        
        let options = {
            url: 'https://api.sandbox.paypal.com/v1/payments/payouts/'+req.body.batchId,
            headers: {
                Authorization: 'Bearer '+ oauth.getAccessToken()
            },
            method: 'GET'
        };
        
        rp(options)
        .then((response) => {
            console.log(response)
            res.render('pages/payouts/getbatchpayouts', {
                response: response
            });
        })
        .catch((error) => {
            console.log(error.body);
            throw new Error(error);
        })
    }
    
};