import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/dbConfig.js";
import userRouter from "./router/userRouter.js";
import messageRouter from "./router/messageRouter.js";
import { sendMessage } from "./controller/messageController.js";
import { jwtTokenType } from "./Types/type";
import jwt from "jsonwebtoken";
import { User } from "./schema/User.js";

const app = express();
app.use(express.json());

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  const time = new Date();
  const istTime = new Date(
    time.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  res.send(istTime);
});

app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

io.on("connection", async (socket) => {
  console.log("🔌 User connected:", socket.id);

  const { token, fcmToken } = socket.handshake.auth;

  if (!token) {
    console.log("❌ No token provided");
    socket.disconnect();
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as jwtTokenType;

    if (!user || !user.id) {
      console.log("❌ Invalid token");
      socket.disconnect();
      return;
    }

    socket.data.user = user;

    await User.findByIdAndUpdate(user.id, {
      socketId: socket.id,
      fcmToken
    });

    console.log(`✅ User ${user.name} authenticated with socket ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`👤 User ${user.name} joined room: ${roomId}`);
    });

    socket.on("sendMessage", sendMessage);

    socket.on("disconnect", async () => {
      console.log(`❌ User ${user.name} disconnected:`, socket.id);

      try {
        await User.findByIdAndUpdate(user.id, {
          socketId: "",
        });
      } catch (error) {
        console.error("Error updating user on disconnect:", error);
      }
    });
  } catch (error) {
    console.error("❌ Authentication error:", error);
    socket.disconnect();
  }
});

connectDB().then(() => {
  server.listen(3000, () => console.log("Server running on 3000"));
});
