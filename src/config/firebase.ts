import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(
    "/home/sudipdey/Desktop/Projects/SAI DEV/chat app/Main Backend/dipdey-d1b0a-firebase-adminsdk-kvves-be7f732bb9.json",
    "utf8",
  ),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const fcm = admin.messaging();
