let webSocket = require('ws');
let firebase = require('firebase');
let admin = require('firebase-admin');

let serviceAccount = require('./serviceAccount.json');

firebase.initializeApp({
    databaseURL: 'https://gdax-be4fa.firebaseio.com',
    credential: admin.credential.cert(serviceAccount)
});

let db = firebase.database().ref();

const ws = new webSocket('wss://ws-feed.gdax.com');

ws.on('open', function() {

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



ws.on('message', function(msg) {

    msg = JSON.parse(msg);

    if (msg.type === 'ticker') {
        db.child(msg.product_id).push(msg).then(null, err => { console.log('error saving to database: ', err )})
    }
    
});

