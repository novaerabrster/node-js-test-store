        //console.log('REQUEST: ' + JSON.stringify(payload));
        /*
        let request = new paypal.PaymentCreateRequest();
        request.requestBody(payload);
        
        let approvalURL;
        
        client
          .execute(request)
          .then((response) => {
  
            console.log('RESPONSE: '+ response.result.id);
            res.json(response.result);
  
          }).catch(handleError);
        */
        
        /*let request = new paypal.PaymentGetRequest(req.body.paymentID);
        
        client
          .execute(request)
          .then((response) => {
            
            res.render('layout', {
              title: 'Payment Details',
              content: 'expresscheckout/paymentdetails',
              details: response.result
            });
            
          }).catch(handleError);*/