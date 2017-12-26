let sock = require('ws');
let utils = require('./utils.js');
const db = utils.db;
const signature = utils.signature;


// currently, CEX is suspending new registrations. When that is lifted, make an account and use authenticated websocket feed
const cex = new sock('wss://ws.cex.io/ws/');

cex.on('open', function() {
    console.log('cex open');
    // authenticate with CEX server
    this.send(signature);

});

cex.on('close', function() {
    console.log('cex closed');
});

cex.on('message', function(msg) {
    console.log('cex message received: ', msg);

    msg = JSON.parse(msg);

    // subscribe to tickers after authentication response is received
    if (msg.e === 'auth' && msg.ok === 'ok') {
        // this is currently marked as deprecated in the CEX.IO api docs, but it also
        // appears to be the only way to subscribe to ticker data
        this.send(JSON.stringify({
            e: 'subscribe',
            rooms: [
                'tickers'
            ]
        }))
    }

    if (msg.e === 'ping') {
        this.send(JSON.stringify({ e: 'pong' }))
    }

    if (msg.e === 'tick') {
        // add tick data to db
    }
});

cex.on('error', function(e) {
    console.log('cex error: ', e);
});

cex.on('ping', function(e) {
    console.log('cex ping: ', e);
    this.send(JSON.stringify({ e: 'pong' }))
});

cex.on('pong', function(e) {
    console.log('cex pong: ', e);
});

