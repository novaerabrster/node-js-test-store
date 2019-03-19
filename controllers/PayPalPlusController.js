//INSTANCIANDO OS MODULOS
const paypal = require('paypal-rest-sdk');
const queryString = require('query-string');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AS-ajsWDGIZEtprpF-6z7jhkrdRdnvTqO6fwu-9RNVeoIJrfwpw6sNNXwaju3_vDlET2NTC7VT9RfuiR',
    'client_secret': 'EMvVpj9cz2r0omnj5CrujgGv7q9ae9GUiFklTn3WqXywIisbxQBRQKAuqwa9Gyj5XL4qx4Rr38pNQB83'
});

function handleError(error){
  console.log('ERROR: '+JSON.stringify(error));
  console.error('ERROR STATUS CODE: '+error.statusCode);
  console.error('ERROR MESSAGE: '+error.message);  
}

module.exports = {

    init: (req, res) => {

        let payload = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "currency": "BRL",
                    "total": 300,
                    "details": {
                        "subtotal": 300
                    }
                },
                "description": "Compra na Loja NodeJS Test Store",
                "payment_options": {
                    "allowed_payment_method": "IMMEDIATE_PAY"
                },
                "item_list": {
                    "items": [{
                        "quantity": 1,
                        "name": "Produto Teste 01",
                        "price": 300,
                        "currency": "BRL"
                    }],
                    "shipping_address": {
                        "recipient_name": "Guilherme",
                        "line1": "Xibolquinha",
                        "line2": "Lol",
                        "city": "Sao Paulo",
                        "country_code": "BR",
                        "postal_code": "01310001",
                        "state": "SP"
                    }
                }
            }],
            "redirect_urls": {
                "return_url": "https://node-js-test-store-gpeluzzo.c9users.io/paypal/ec/detailtransaction",
                "cancel_url": "https://node-js-test-store-gpeluzzo.c9users.io/paypal/ec/createpayment"
            }

        };

        paypal.payment.create(payload, (error, payment) => {
            if (error) {
                handleError(error);
            } else {
                console.log('RESPONSE: ' + payment.id);
                res.render('layout', {
                    title: 'PayPal Plus',
                    content: 'paypalplus/form',
                    payload: payment,
                    createPaymentRequest: payload
                });
            }
        });
    },
    executePayment : (req, res) => {
        console.log(req.body);
        let payload = {
            payer_id: req.body.payerID,
            transactions: JSON.parse(req.body.createPaymentRequest).transactions
        };
        paypal
        .payment
        .execute(req.body.paymentID, payload, (error, payment) => {
            if(error){
              handleError(error);
              res.json({
                  success: false
              });
            }else{
              res.json({
                  success: true,
                  response: payment
              });
            }
        });
    },
    
    disputeCreated: (req, res) => {
        console.log(req.body);
    }

};