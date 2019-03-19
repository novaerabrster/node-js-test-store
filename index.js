//Depndencias

//Facilita a renderização de eJS e conversão entre view e controller
var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');

var oauth = require('./helpers/AuthorizationHelper.js');

//SETUP
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    accessToken: null,
    resave: true,
    saveUninitialized: true,
    secret: 'sssshhhh'
}));


//ROUTES
app.get('/', (req, res) => {
    
    if(oauth.getAccessToken() == undefined){ 
     
        oauth.initCache();
        
    }
    
    res.render('layout', {
        title: 'NodeJS Test Store',
        content: 'home'
    });
    
})

var paypalplus = require('./routes/paypalplus.js');
app.use('/paypal/plus', paypalplus);

var expressCheckout = require('./routes/expresscheckout.js');
app.use('/paypal/ec', expressCheckout);

var referenceTransaction = require('./routes/referencetransaction.js');
app.use('/paypal/rt', referenceTransaction);

var payouts = require('./routes/payouts.js');
app.use('/paypal/po', payouts);

var utils = require('./routes/utils.js');
app.use('/paypal/utils', utils);

var messenger = require('./routes/messenger.js');
app.use('/messenger', messenger);

var lipp = require('./routes/lipp.js');
app.use('/lipp', lipp);

var btdcc = require('./routes/braintreedcc.js');
app.use('/btdcc', btdcc);

//SERVERINIT
var server = app.listen(process.env.PORT, () =>{
    console.log('server iniciado');
})