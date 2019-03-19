//INSTANCIANDO OS MODULOS
const queryString = require('query-string');
const request = require('request');
const oauth = require('../helpers/AuthorizationHelper.js');

var url = 'https://api-3t.sandbox.paypal.com/nvp';

module.exports = {
    
    init: (req, res) => {
        
        res.render('layout', {
            title: 'Express Checkout',
            content: 'referencetransaction/form'
        });
    },
    
    setExpressCheckout: (req, res) => {
        
        let form = queryString.parse(req.body.data);
        
        let payload = {
            
            USER: form.merchantUser,
            PWD: form.merchantPass,
            SIGNATURE: form.merchantSignature,
            
            L_BILLINGTYPE0: 'MerchantInitiatedBillingSingleAgreement',
            L_BILLINGAGREEMENTDESCRIPTION0: 'Teste de reference transaction.',
            L_BILLINGAGREEMENTCUSTOM0: 'Dados customizados para descrição.',
         
            VERSION: '204.0',
            METHOD: form.method,
         
            PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
        
            PAYMENTREQUEST_0_AMT: form.totalAmt,
            PAYMENTREQUEST_0_CURRENCYCODE: 'BRL',
            PAYMENTREQUEST_0_ITEMAMT: form.totalAmt,
            PAYMENTREQUEST_0_INVNUM: form.invoiceNumber,
         
            L_PAYMENTREQUEST_0_NAME0: form.itemCode,
            L_PAYMENTREQUEST_0_DESC0: form.itemDesc,
            L_PAYMENTREQUEST_0_AMT0: form.itemValue,
            L_PAYMENTREQUEST_0_QTY0: form.itemQty,
        
            RETURNURL: form.returnUrl,
            CANCELURL: form.cancelUrl,
            BUTTONSOURCE: 'BR_EC_EMPRESA'
            
        };
        
        
        
        let options = {
            url: url,
            headers: {},
            method: 'POST',
            body: queryString.stringify(payload)
        };
        
        console.log(options);
        
        request(options, (error, response, body) => {
            
            if (error) throw new Error(error);
            
            console.log(response.body);
            console.log('-----------------------');
            res.json(queryString.parse(response.body));
        });
        /*console.log('REQUEST: '+queryString.stringify(payload));
        request.post(url, null, (err,response,body) => {
            console.log('RESPONSE: '+JSON.stringify(queryString.parse(response.body)));
        });*/
        
    },
    
    createBillingAgreement: (req, res) => {
        
        let payload = {
            
            USER: req.body.merchantUser,
            PWD: req.body.merchantPass,
            SIGNATURE: req.body.merchantSignature,
            
            METHOD: 'CreateBillingAgreement',
            VERSION: '204.0',
            
            TOKEN: req.body.token
            
        };
        
        let options = {
            url: url,
            headers: {},
            method: 'POST',
            body: queryString.stringify(payload)
        };
        
        request(options, (error, response, body) => {
            
            if (error) throw new Error(error);
            
            let responseJSON = queryString.parse(response.body);
            console.log(responseJSON);
            
            res.render('pages/referencetransaction/billingagreementdetails', {
                response: {
                    billingAgreementId: responseJSON.BILLINGAGREEMENTID,
                    amount: req.body.amount
                }
            });
            
        });
        
    },
    
    calculateFinancingOptions: (req, res) => {
        
        console.log('-----------------------');
        console.log('calculateFinancingOptions');
    
        let payload = {
                	financing_country_code: "BR",
                	transaction_amount:
                	{
                		value: req.body.amount,
                		currency_code: "BRL"
                		
                	},
                	funding_instrument:
                	{
                		type: "BILLING_AGREEMENT",
                		billing_agreement:
                		{
                			billing_agreement_id: req.body.billingAgreementId
                		}
                	}
                };
        let options = {
            url: 'https://api.sandbox.paypal.com/v1/credit/calculated-financing-options',//'https://node-js-test-store-gpeluzzo.c9users.io/paypal/utils/inspectpayload',
            headers: {
                Authorization: 'Bearer '+oauth.getAccessToken(),
                'Content-Type':'application/json'
            },
            method: 'POST',
            json: true,
            body: payload
        };
        
        console.log(JSON.stringify(options.form));
    
        request(options, (error, response, body) => {
            
            if (error) throw new Error(error);
            //console.log('calculateFinancingOptions-RESPONSE');
            //console.log(JSON.stringify(response.body));
            res.render('layout', {
                title: 'Express Checkout',
                content: 'referencetransaction/financingoptions',
                financingOptions: response.body,
                amount: req.body.amount,
                billingAgreementId: req.body.billingAgreementId
            });
            
        });

        
    },
    
    createPayment: (req, res) => {
        console.log(req.body);
        let termJSON = JSON.parse(req.body.selectedTerm);
        let payload = {
            intent:"sale",
            payer: {
                funding_instruments: [{
                    billing: {
                        billing_agreement_id: req.body.billingAgreementId,
                        selected_installment_option: {
                            term: termJSON.credit_financing.term,
                            monthly_payment: {
                                currency: termJSON.monthly_payment.currency_code,
                                value: termJSON.monthly_payment.value
                            },
                            discount_percentage: termJSON.discount_percentage != undefined ? termJSON.discount_percentage : 0 ,
                            discount_amount: termJSON.discount_amount != undefined ? {  currency: termJSON.discount_amount.currency_code,
                                                                                        value: termJSON.discount_amount.value
                                                                                     } : {currency: 'BRL', value: 0}
                        }
                    }
                }],
                payment_method: "paypal"
            },
            transactions: [{
                amount: {
                    currency: 'BRL',
                    total: req.body.amount
                },
                description: 'Compra realizada na NodeJS Test Store',
                item_list: {
                    shipping_address: {
                        recipient_name: "Guilherme",
                        line1: "Xibolquinha",
                        line2: "Lol",
                        city: "Sao Paulo",
                        country_code: "BR",
                        postal_code: "01310001",
                        state: "SP",
                        phone: '11950002606'
                    },
                    items: [{
                        quantity: 1,
                        name: "Produto Teste 01",
                        price: req.body.amount,
                        currency: "BRL",
                        sku: 'SKU0001ABC',
                        description: 'DESCR TEST TETEST',
                        tax:'0'
                    }]
                }
            }],
            redirect_urls: {
                return_url: 'https://node-js-test-store-gpeluzzo.c9users.io/paypal/rt/',
                cancel_url: 'https://node-js-test-store-gpeluzzo.c9users.io/paypal/rt/'
            }
        }; 

        console.log(JSON.stringify(payload));

        let options = {
            url: 'https://api.sandbox.paypal.com/v1/payments/payment',//'https://node-js-test-store-gpeluzzo.c9users.io/paypal/utils/inspectpayload'
            headers: {
                Authorization: 'Bearer '+oauth.getAccessToken(),
                'Content-Type':'application/json'
            },
            method: 'POST',
            json: true,
            body: payload
        }
        
        request(options, (error, response, body) => {
            
            if (error) {
                console.log(error);
                throw new Error(error);
                
            }
            console.log(response.body);
            
            res.render('layout', {
                title: 'Express Checkout',
                content: 'referencetransaction/paymentexecutiondetails',
                response: response.body
            });  

        });

    }
    
};