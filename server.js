const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const port = 3000;

// Using path.join to construct the path to the Firebase service account file
const serviceAccount = require(path.join(__dirname, 'js', 'projectinfosystem-c7a40-firebase-adminsdk-1wzrs-131919a3c7.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://projectinfosystem-c7a40-default-rtdb.europe-west1.firebasedatabase.app/'
});

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Assign Admin Role Endpoint
app.post('/assignAdmin', (req, res) => {
  const uid = req.body.uid;
  admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
      res.status(200).send(`Admin role assigned to user ${uid}`);
    })
    .catch(error => {
      res.status(500).send(`Error assigning admin role: ${error.message}`);
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});