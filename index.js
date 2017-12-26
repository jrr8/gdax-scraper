let sock = require('ws');
let firebase = require('firebase');
let admin = require('firebase-admin');

let serviceAccount = require('./serviceAccount.json');

firebase.initializeApp({
    databaseURL: 'https://gdax-be4fa.firebaseio.com',
    credential: admin.credential.cert(serviceAccount)
});

let db = firebase.database().ref();


// GDAX socket

const gdax = new sock('wss://ws-feed.gdax.com');


gdax.on('open', function() {
    console.log('gdax connected');

    const subscribeData = {
        type: 'subscribe',
        product_ids: [
            'BTC-USD',
            'ETH-USD',
            'LTC-USD'
        ],
        channels: [
            'ticker'
        ]
    };

    this.send(JSON.stringify(subscribeData));

});


gdax.on('message', function(msg) {

    msg = JSON.parse(msg);

    if (msg.type === 'ticker') {
        db.child(msg.product_id).push(msg).then(null, err => { console.log('error saving to database: ', err )})
    }
    
});

gdax.on('close', function(err, msg) {
   console.log("GDAX WEBSOCKET CLOSED !!!!: \n", err, msg)
});

gdax.on('headers', function(h, r) {
    console.log("headers received: ")
});

gdax.on('ping', function(d) {
    console.log("ping received: ", d)
});

gdax.on('pong', function(d) {
    console.log("pong received: ", d)
});



// CEX Socket

const cex = new sock('wss://ws.cex.io/ws/');



// dummy server required for Heroku
//require('express')().listen(process.env.PORT || 3000);
