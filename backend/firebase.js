const admin = require('firebase-admin');

const serviceAccount = require('./admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://studynest-8373b.firebaseio.com',
});

const db = admin.firestore();

module.exports = { db };
