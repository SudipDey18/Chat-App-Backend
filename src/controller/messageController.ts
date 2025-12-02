import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ChatRoom } from "../schema/ChatRoom.js";
import { Message } from "../schema/Message.js";
import { jwtTokenType } from "../Types/type.js";
import { io } from "../app.js";
import { User } from "../schema/User.js";
import { sendNotification } from "../helper/notification.js";

// export const sendMessage = async (req: Request, res: Response) => {
//     const { message, receiver } = req.body;
//     const { authorization } = req.headers;

//     try {
//         const token = authorization?.replace("Bearer ", "");

//         if (!token) {
//             return res.status(401).json({ message: "Invalid token provided" });
//         }

//         const sender = jwt.decode(token) as jwtTokenType | null;
//         if (!sender) {
//             return res.status(400).json({ message: "Invalid token type" });
//         }

//         const oldRoom = await ChatRoom.findOne({
//             participants: { $all: [receiver, sender.id] }
//         });

//         const createdMessage = await Message.create({
//             sender: sender.id,
//             receiver,
//             message
//         });

//         if (!createdMessage) {
//             return res.status(400).json({ message: "Error while sending message" });
//         }

//         if (!oldRoom) {
//             await ChatRoom.create({
//                 participants: [receiver, sender.id],
//                 messages: [createdMessage._id]
//             });
//         } else {
//             oldRoom.messages.unshift(createdMessage._id);
//             await oldRoom.save();
//         }

//         const populatedMessage = await Message.findById(createdMessage._id)
//             .populate({
//                 path: "sender",
//                 select: "name _id"
//             })
//             .select("sender _id message createdAt receiver");

//         return res.status(200).json({
//             message: "Message sent successfully",
//             newMessage: populatedMessage
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Error while sending message" });
//     }
// };

export const sendMessage = async (data: any, callback?: Function) => {
  const { roomId, message, sender, reciver, _id } = data;

  try {
    let room = await ChatRoom.findOne({
      participants: { $all: [reciver, sender._id] },
    });

    const createdMessage = await Message.create({
      sender: sender._id,
      receiver: reciver,
      message,
    });

    if (!createdMessage) {
      throw new Error("Error while creating message");
    }

    let senderData = await User.findById(sender._id).select("socketId fcmToken");
    let reciverData = await User.findById(reciver).select("socketId fcmToken");

    if (!room) {
      room = await ChatRoom.create({
        participants: [reciver, sender._id],
        messages: [createdMessage._id],
      });

      const newRoomForSender = await ChatRoom.findById(room._id)
        .populate({
          path: "participants",
          match: { _id: { $ne: sender._id } },
          select: "_id name",
        })
        .select("participants");

      console.log(newRoomForSender);

      if (senderData?.socketId && newRoomForSender) {
        io.to(senderData.socketId).emit("receiveRoom", newRoomForSender);
      }

      if (reciverData?.socketId) {
        const newRoomForReciver = await ChatRoom.findById(room._id)
          .populate({
            path: "participants",
            match: { _id: sender._id },
            select: "_id name",
          })
          .select("participants");

        console.log(newRoomForReciver);

        if (newRoomForReciver)
          io.to(reciverData.socketId).emit("receiveRoom", newRoomForReciver);
      }

      io.to(senderData?.socketId || "")
        .to(reciverData?.socketId || "")
        .emit("receiveMessage", {
          _id: createdMessage._id,
          oldId: _id,
          roomId: room._id,
          message,
          reciver,
          sender,
          createdAt: createdMessage.createdAt,
        });
    } else {
      room.messages.unshift(createdMessage._id);
      await room.save();

      io.to(roomId).emit("receiveMessage", {
        _id: createdMessage._id,
        oldId: _id,
        roomId,
        message,
        reciver,
        sender,
        createdAt: createdMessage.createdAt,
      });
    }

    if(reciverData && reciverData.fcmToken && !reciverData.socketId){
      sendNotification(reciverData.fcmToken, sender.name);
    }


    if (callback) {
      callback({
        success: true,
        messageId: createdMessage._id,
        createdAt: createdMessage.createdAt,
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);

    if (callback) {
      callback({
        success: false,
        error: "Failed to send message",
      });
    }
  }
};

export const getMessage = async (req: Request, res: Response) => {
  const { receiver } = req.params;
  const { authorization } = req.headers;
  try {
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(404).json({ message: "Invald token Provided" });
    }
    const sender: any = jwt.decode(token);

    const oldRoom = await ChatRoom.findOne({
      participants: { $all: [receiver, sender.id] },
    })
      .populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "name _id",
        },
      })
      .select("messages");

    res
      .status(200)
      .json({
        message: "message Fetched sucessfully",
        allMessages: oldRoom?.messages || [],
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while Reciving message" });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  try {
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(404).json({ message: "Invald token Provided" });
    }

    const sender: jwtTokenType | null = jwt.decode(
      token,
    ) as jwtTokenType | null;

    if (!sender) {
      return res.status(400).json({ messahe: "Invalid Token type" });
    }

    const rooms = await ChatRoom.find({ participants: sender.id })
      .populate({
        path: "participants",
        match: { _id: { $ne: sender.id } },
        select: "_id name",
      })
      .select("participants");

    res
      .status(200)
      .json({ message: "message Fetched sucessfully", rooms: rooms || [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while Reciving message" });
  }
};

export const searchContact = async (req: Request, res: Response) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Search data is required" });
  }

  try {
    const user = await User.find({
      name: {
        $regex: name.toString(),
        $options: "i",
      },
    }).select("_id name");

    res
      .status(200)
      .json({ message: "Contacts Fetched sucessfully", users: user || [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while Search contacts" });
  }
};
