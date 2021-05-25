import admin from "firebase-admin";

const serviceAccount = require("../keys.json");

admin.initializeApp(
  // @ts-ignore
  { credential: admin.credential.cert(serviceAccount) }
);

export const db = admin.firestore();
