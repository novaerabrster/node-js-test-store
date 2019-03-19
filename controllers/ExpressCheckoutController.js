var paypal = require('paypal-rest-sdk');
const queryString = require('query-string');
//var env = new paypal.SandboxEnvironment('AS-ajsWDGIZEtprpF-6z7jhkrdRdnvTqO6fwu-9RNVeoIJrfwpw6sNNXwaju3_vDlET2NTC7VT9RfuiR','EMvVpj9cz2r0omnj5CrujgGv7q9ae9GUiFklTn3WqXywIisbxQBRQKAuqwa9Gyj5XL4qx4Rr38pNQB83');
//var client = new paypal.PayPalHttpClient(env);

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
      res.render('layout', {
        title: 'Express Checkout',
        content: 'expresscheckout/form'
      });
    },
    
    createPayment: (req, res) => {
        //console.log(paypal);
        console.log(req.body.data);
        let data = queryString.parse(req.body.data);
        
        //console.log();
        
        let payload = {
              "intent": data.intent,
              "payer": {
                "payment_method": "paypal"
              },
              application_context : {
                landing_page: req.body.page // Login or Billing
              },
              "transactions": [
                {
                  "amount": {
                    "currency": "BRL",
                    "total": data.totalAmt,
                    "details": {
                      "subtotal": data.totalAmt
                    }
                  },
                  "description": "Compra na Loja NodeJS Test Store",
                  "payment_options": {
                    "allowed_payment_method": "IMMEDIATE_PAY"
                  },
                  "item_list": {
                    "items": [
                      {
                        "quantity": data.itemQty,
                        "name": data.itemDesc,
                        "price": data.itemValue,
                        "currency": "BRL"
                      }
                    ],
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
                }
              ],
              "redirect_urls": {
                "return_url": "https://node-js-test-store-gpeluzzo.c9users.io/paypal/ec/detailtransaction",
                "cancel_url": "https://node-js-test-store-gpeluzzo.c9users.io/paypal/ec/createpayment"
              }
            
        };
        
        paypal.payment.create(payload, (error, payment) => {
          if(error){
            handleError(error);
          }else{
            console.log('RESPONSE: '+ payment.id);
            res.json(payment);
          }
        });

    },
    
    detailPayment: (req, res) => {

      paypal.payment.get(req.body.paymentID, (error, payment) => {
        
        res.render('pages/expresscheckout/paymentdetails', {
          details: payment
        });
        
      });
          
          
    }, 
    
    detailPaymentReturn: (req, res) => {

      paypal.payment.get(req.body.paymentID, (error, payment) => {

        res.render('pages/expresscheckout/paymentdetails', {
          details: payment
        });
        
      });
          
          
    }, 
    executePayment: (req, res) => {
        console.log(JSON.stringify(req.body));
        let paymentDetails = JSON.parse(req.body.dataString);
        delete paymentDetails.transactions[0].item_list.shipping_address.normalization_status;
        let payload = {
          payer_id: paymentDetails.payer.payer_info.payer_id,
          transactions: [{
            amount: paymentDetails.transactions[0].amount,
            description: paymentDetails.transactions[0].description,
            item_list: paymentDetails.transactions[0].item_list
          }]
          
        };
        console.log('EXECUTE PAYMENT REQUEST: '+JSON.stringify(payload));
        paypal
          .payment
          .execute(req.body.id, payload, (error, response) => {
            console.log('EXECUTE PAYMENT RESPONSE: ' + JSON.stringify(response));
            if(error){
              handleError(error);
            }else{
              res.render('layout', {
                
                title: 'Express Checkout',
                content: 'expresscheckout/paymentexecute',
                response: response
                
              });
            }
            
          });
        
    }, 
    getTransactionDetails: (req, res) =>{
        
    },
    
    capturePayment : (req, res) => {
      console.log(req.body);
      
      let request = {
        amount: {
          currency: 'BRL',
          total: req.body.total
        } ,
        is_final_capture: true
      };
      
      paypal
        .authorization
        .capture(req.body.authorizationId, request, (error, capture) => {
            if (error) {
              console.error(error); 
              handleError(error);
            } else {
              console.log(capture);
              res.render('layout', {
                title: 'CapturePayment Response',
                content: 'expresscheckout/capturepayment',
                response: capture
              });
            }
            
          });
      
    }
    
};

/*exports.init = 
  (req, res) => {
    res.render('layout', {
      title: 'Express Checkout',
      content: 'expresscheckout/form'
    });
  };

exports.createPayment = 
  (req, res) => {
    //console.log(paypal);
    console.log(req.body.data);
    let data = queryString.parse(req.body.data);
    
    //console.log();
    
    let payload = {
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "transactions": [
            {
              "amount": {
                "currency": "BRL",
                "total": data.totalAmt,
                "details": {
                  "subtotal": data.totalAmt
                }
              },
              "description": "Compra na Loja NodeJS Test Store",
              "payment_options": {
                "allowed_payment_method": "IMMEDIATE_PAY"
              },
              "item_list": {
                "items": [
                  {
                    "quantity": data.itemQty,
                    "name": data.itemDesc,
                    "price": data.itemValue,
                    "currency": "BRL"
                  }
                ],
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
            }
          ],
          "redirect_urls": {
            "return_url": "https://node-js-test-store-gpeluzzo.c9users.io/paypal/ec/detailtransaction",
            "cancel_url": "https://node-js-test-store-gpeluzzo.c9users.io/paypal/ec/createpayment"
          }
        
    };
    
    paypal.payment.create(payload, (error, payment) => {
      if(error){
        handleError(error);
      }else{
        console.log('RESPONSE: '+ JSON.stringify(payment.id));
        res.json(payment);
      }
    });

};

exports.detailTransaction = 
(req, res) => {
  //req.query.paymentId
  console.log(req.body);
  paypal.payment.get(req.body.paymentID, (error, payment) => {
    console.log(JSON.stringify(payment));
    res.render('layout', {
      title: 'Payment Details',
      content: 'expresscheckout/paymentdetails',
      details: payment
    });
  });
}
*/