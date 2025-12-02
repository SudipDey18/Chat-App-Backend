import { fcm } from "../config/firebase";

export async function sendNotification(token:string,name:string) {
    if (!token) return

    const message = {
        token,
        notification: {
            title: "💬 New Message",
            body: `Message recived from ${name}` || "You have a message",
        },
        data: {},
    };

    try {
        await fcm.send(message);
        return
    } catch (err) {
        console.error("FCM Error", err);
        return
    }
}