const NodeCache = require( 'node-cache' );
const rp = require('request-promise');

const cache = new NodeCache({ stdTTL: 18000, checkperiod: 120 });
cache.on( "expired", function( key, value ){
    if(key == 'accessToken'){
        oauth()
        .then((accessToken) =>{
            cache.set('accessToken', accessToken)
        });
    }
});





function oauth() {
    console.log('getAccessToken');
    console.log('-----------------------');
    let payload = {
        grant_type: 'client_credentials',
        response_type: 'token',
        return_authn_schemes: true
    };
    
    let options = {
        url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
        headers: {
            Authorization: 'Basic QVMtYWpzV0RHSVpFdHBycEYtNno3amhrcmRSZG52VHFPNmZ3dS05Uk5WZW9JSnJmd3B3NnNOTlh3YWp1M192RGxFVDJOVEM3VlQ5UmZ1aVI6RU12VnBqOWN6MnIwb21uajVDcnVqZ0d2N3E5YWU5R1VpRmtsVG4zV3FYeXdJaXNieFFCUlFLQXVxd2E5R3lqNVhMNHF4NFJyMzhwTlFCODM=',
            'Content-Type':'application/json'
        },
        method: 'POST',
        //json: true,
        form: payload
    };
    
    console.log('calling service');
    console.log('-----------------------');
    return rp(options)
        .then((response) => {
            console.log(response);
            return JSON.parse(response).access_token;
        })
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        });

}
    
module.exports = {
    
    initCache: () => {
        console.log('initializing cache')
        console.log('-----------------------');
        oauth()
        .then((accessToken) => {
            cache.set('accessToken', accessToken);
            return accessToken;
        });
    },
    getAccessToken: () => {
        return cache.get('accessToken');
    }
    
    
}





