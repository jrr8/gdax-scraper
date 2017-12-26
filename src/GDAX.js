let sock = require('ws');
let db = require('./utils.js').db;

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
        db.child(msg.product_id).push(msg).then(null, err => { console.log('error saving to database: ', err )});
    }
});

gdax.on('error', function(e) {
    console.log('gdax socket error: ', e);
});

gdax.on('close', function(c, d) {
    console.log('gdax socket closed with error code: ', c, ' and description: ', d);
});