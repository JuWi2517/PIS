const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const port = 3000;


const serviceAccount = require('./projectinfosystem-c7a40-firebase-adminsdk-1wzrs-131919a3c7.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://projectinfosystem-c7a40-default-rtdb.europe-west1.firebasedatabase.app/'
});


app.use(bodyParser.json());
app.use(cors());


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

app.post('/removeAdmin', (req, res) => {
  const uid = req.body.uid;

  admin.auth().setCustomUserClaims(uid, { admin: false })
    .then(() => {
      res.status(200).send(`Admin role removed from user ID: ${uid}`);
    })
    .catch(error => {
      res.status(500).send(`Error removing admin role: ${error.message}`);
    });
});

app.post('/assignWarehouseWorker', (req, res) => {
  const uid = req.body.uid;
  admin.auth().setCustomUserClaims(uid, { warehouse: true })
    .then(() => {
      res.status(200).send(`WarehouseWorker assigned to user: ${uid}`);
    })
    .catch(error => {
      res.status(500).send(`Error assigning warehouse role: ${error.message}`);
    });
});

app.post('/removeWarehouseWorker', (req, res) => {
  const uid = req.body.uid;
  admin.auth().setCustomUserClaims(uid, { warehouse: false })
    .then(() => {
      res.status(200).send(`WarehouseWorker removed from user: ${uid}`);
    })
    .catch(error => {
      res.status(500).send(`Error assigning warehouse role: ${error.message}`);
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
