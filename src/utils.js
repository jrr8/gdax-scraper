let firebase = require('firebase');
let admin = require('firebase-admin');
let crypt = require('crypto');

let creds = require('../config.js');

// firebase configuration

firebase.initializeApp({
    databaseURL: 'https://gdax-be4fa.firebaseio.com',
    credential: admin.credential.cert(creds.firebase)
});

let db = firebase.database().ref();



// CEX signature functions
function cexSignature() {
    let timestamp = Math.floor(Date.now() / 1000);  // Note: java and javascript timestamp presented in miliseconds
    let hmac = crypt.createHmac('sha256', creds.cex.apiSecret );
    hmac.update( timestamp + creds.cex.apiKey );
    let args = { e: 'auth', auth: { key: creds.cex.apiKey,
        signature: hmac.digest('hex'), timestamp: timestamp } };
    return JSON.stringify(args);
}


module.exports = {
    db: db,
    signature: cexSignature()
};