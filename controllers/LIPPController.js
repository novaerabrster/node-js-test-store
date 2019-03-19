var paypal = require("paypal-rest-sdk");
var openIdConnect = paypal.openIdConnect;

module.exports = {
    
    init: (req, res) => {
      res.render('layout', {
        title: 'LogIn With PayPal',
        content: 'lipp/form'
      });
    },
    
    login: (req, res) => {
      console.log('configurando o sdk do paypal');  
      paypal.configure({
          'mode': 'sandbox',
          'openid_client_id': 'AS-ajsWDGIZEtprpF-6z7jhkrdRdnvTqO6fwu-9RNVeoIJrfwpw6sNNXwaju3_vDlET2NTC7VT9RfuiR',
          'openid_client_secret': 'EMvVpj9cz2r0omnj5CrujgGv7q9ae9GUiFklTn3WqXywIisbxQBRQKAuqwa9Gyj5XL4qx4Rr38pNQB83',
          'openid_redirect_uri': 'lipp/login'
      });
      
      console.log('utilizando openId connect');  
      openIdConnect.tokeninfo.create(req.query.code, function (error, tokeninfo) {
          if (error) {
              console.error(error);
          } else {
              openIdConnect.userinfo.get(tokeninfo.access_token, function (error, userinfo) {
                  if (error) {
                      console.log(error);
                      res.json(error);
                  } else {
                      console.log(tokeninfo);
                      console.log(userinfo);
                      // Logout url console.log(openIdConnect.logoutUrl({ 'id_token': tokeninfo.id_token }));
                      res.json(userinfo);
                  }
              });
          }
      });
    }
    
}