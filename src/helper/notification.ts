import { fcm } from "../config/firebase.js";

export async function sendNotification(token:string,name:string,id:string) {
    if (!token) return

    const message = {
        token,
        notification: {
            title: "💬 New Message",
            body: `Message recived from ${name}` || "You have a message",
        },
        data: {id,newMessage: "true"},
    };

    try {
        console.log(await fcm.send(message));
        return
    } catch (err) {
        console.error("FCM Error", err);
        return
    }
}