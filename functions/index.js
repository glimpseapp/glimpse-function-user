'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const app = express();

// Validate the user is logged in taking the Firebase JWT, and adding uid and email to the req.user
const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    if (req.originalUrl == '/healthz') {
        return res.send({status: true});
    }

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(403).send('Unauthorized');
    }

    // Read the ID Token from the Authorization header.
    let idToken = req.headers.authorization.split('Bearer ')[1];

    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        console.log('ID Token correctly decoded', decodedIdToken);
        req.user = decodedIdToken;
        next();
    }).catch(error => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
    });
};

app.use(validateFirebaseIdToken);

app.get('/me', (req, res) => {
    admin.database().ref(`/users/${req.user.uid}`).once('value').then(user => res.send(user.val()));
});

app.post('/user', (req, res) => {
    var data = {
        user_id: req.user.uid,
        name: req.body.name,
        email: req.user.email
    };
    admin.database().ref(`users/${req.user.uid}`).set(data, function (error) {
        if (error)
            res.send({error: error})
        else
            res.send({success: true});
    });
});

exports.user = functions.https.onRequest(app);
