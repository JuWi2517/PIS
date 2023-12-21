const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');

  
const serviceAccount = require(path.join(__dirname, 'js', 'projectinfosystem-c7a40-firebase-adminsdk-1wzrs-131919a3c7.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projectinfosystem-c7a40-default-rtdb.europe-west1.firebasedatabase.app/" // Replace with your Firebase database URL
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
      res.status(500).send(`Error assigning admin role: ${error}`);
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});