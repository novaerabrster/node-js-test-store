//Depndencias

//Facilita a renderização de eJS e conversão entre view e controller
var express = require('express');
var bodyParser = require('body-parser');

//SETUP
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



//ROUTES
app.get('/', (req, res) => {
    
    res.render('layout', {
        title: 'NodeJS Test Store',
        content: 'home'
    });
    
})

var paypalplus = require('./routes/paypalplus.js');
app.use('/paypal/plus',paypalplus);

var expressCheckout = require('./routes/expresscheckout.js');
app.use('/paypal/ec', expressCheckout);

//SERVERINIT
var server = app.listen(process.env.PORT, () =>{
    console.log('server iniciado');
})