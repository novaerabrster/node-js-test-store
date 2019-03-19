const braintree = require("braintree");
const queryString = require('query-string');

function handleError(error){
  console.log('ERROR: '+JSON.stringify(error));
  console.error('ERROR STATUS CODE: '+error.statusCode);
  console.error('ERROR MESSAGE: '+error.message);  
}

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId:   'vdc5nv3x5jmntmwf',
  publicKey:    '3cgvjz376d6m44z6',
  privateKey:   '1819207d03860d4493110de328082d65'
});

module.exports = {
    
    init: (req, res) => {
        
        gateway.clientToken.generate({}, function (err, response) {
            
            if(err){
                console.log(err);
                res.json(err);
                return;
            }
            
            console.log('ClientToken Generate Response: ')
            console.log(JSON.stringify(response));
            console.log('----------------------------')
            
            res.render('layout', {
               
                title: 'Braintree DCC',
                content: 'braintreedcc/form',
                token: response.clientToken
                
            });
            
        });
       
    },
    
    addCard: (req, res) => {
        console.log('Persisting');
        console.log(req.body);
        gateway.customer.create({
            paymentMethodNonce: req.body.nonce
        }, function (err, createCustomerResponse) {
            console.log(JSON.stringify(createCustomerResponse));
            if (err || !createCustomerResponse.success) {
                
                console.log(JSON.stringify(err))
                return;
            }
            // gateway.paymentMethod.create({
            //     customerId: createCustomerResponse.customer.id,
            //     paymentMethodNonce: req.body.nonce
            // }, function (err, result) {
            // })
            
             res.json(createCustomerResponse);
            
        });

    },
    pay: (req, res) => {
        console.log('---------');
        console.log(req.body);
        console.log('RECEBENDO REQUEST DE PAGAMENTO');
        gateway.transaction.sale({
            amount: req.body.amount,
            paymentMethodToken: req.body.token,
            options: {
              submitForSettlement: true
            }
        }, function (err, result) {
            
            if (result.success) {
              console.log('PAYMENT RESULT: ');
              console.log(JSON.stringify(result));
              console.log('-----------------------');
              
            } else {
              
              console.log('DEU MERDA');
              console.log(result);
              
            }
        });
    }
}