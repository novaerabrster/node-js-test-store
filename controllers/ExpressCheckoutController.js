var paypal = require('paypal-rest-sdk');
const queryString = require('query-string');
var env = new paypal.SandboxEnvironment('AS-ajsWDGIZEtprpF-6z7jhkrdRdnvTqO6fwu-9RNVeoIJrfwpw6sNNXwaju3_vDlET2NTC7VT9RfuiR','EMvVpj9cz2r0omnj5CrujgGv7q9ae9GUiFklTn3WqXywIisbxQBRQKAuqwa9Gyj5XL4qx4Rr38pNQB83');
var client = new paypal.PayPalHttpClient(env);

function handleError(error){
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
        console.log(paypal);
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
                "return_url": "https://node-js-test-store-gpeluzzo.c9users.io/paypal/ec/detailTransaction",
                "cancel_url": "https://node-js-test-store-gpeluzzo.c9users.io/paypal/ec/createpayment"
              }
            
        };
        
        //console.log('REQUEST: ' + JSON.stringify(payload));
        
        let request = new paypal.PaymentCreateRequest();
        request.requestBody(payload);
        
        let approvalURL;
        
        client
          .execute(request)
          .then((response) => {
  
            console.log('RESPONSE: '+ response.result.id);
            res.json(response.result);
  
          }).catch(handleError);

        //res.send()
    },
    detailTransaction: (req, res) => {
        //let payload = {payment_id: req.paymentId};
        console.log(req.body);
        let request = new paypal.PaymentGetRequest(req.body.paymentID);
        //request.requestBody(payload);
        
        client
          .execute(request)
          .then((response) => {
            
            res.render('layout', {
              title: 'Payment Details',
              content: 'expresscheckout/paymentdetails',
              details: response.result
            });
            
          }).catch(handleError);
    }, 
    executePayment: (req, res) => {
        
    }, 
    getTransactionDetails: (req, res) =>{
        
    }
    
};