import express from 'express';
import admin from 'firebase-admin'
import serviceAccount from './keys.json'
const app = express();
admin.initializeApp(
// @ts-ignore
    {credential: admin.credential.cert(serviceAccount)}
)
const db = admin.firestore()
const port = 3000;



app.listen(port);
console.log(`server is listening on ${port}`);
