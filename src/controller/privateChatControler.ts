import { Request, Response } from "express";
import { PrivateChatRoom } from "../schema/PrivateChats.js";
import { jwtTokenType } from "../Types/type.js";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import mongoose from "mongoose";

interface JoinRoomPayload {
  roomId: string;
  user: string;
}

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const { name } = req.body;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Invalid token provided" });
    }

    const user = jwt.decode(token) as jwtTokenType | null;
    if (!user) {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const oldRoom = await PrivateChatRoom.findOne({
      owner: user.id,
      name,
    });

    if (oldRoom) {
      return res
        .status(400)
        .json({ message: "Room already exist with this name." });
    }

    const newRoom = await PrivateChatRoom.create({
      owner: user.id,
      name,
    });

    res
      .status(200)
      .json({ message: "Room Created Successfully.", id: newRoom._id });
  } catch (e) {
    res
      .status(500)
      .json({ message: "something went wrong while creating room." });
  }
};

export const getRooms = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Invalid token provided" });
    }

    const user = jwt.decode(token) as jwtTokenType | null;
    if (!user) {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const oldRoom = await PrivateChatRoom.find({
      owner: user.id,
    });

    res.status(200).json({ rooms: oldRoom });
  } catch (e) {
    res
      .status(500)
      .json({ message: "something went wrong while fetching room." });
  }
};

export const joinRoom = async (socket: Socket, data: JoinRoomPayload) => {
  // console.log(data);

  if (!mongoose.Types.ObjectId.isValid(data.roomId)) {
    socket.emit("joinError", {
      message: "Enter Valid Room Id",
    });
    return;
  }
  joinRoom;

  const room = await PrivateChatRoom.findById(data.roomId);

  if (!room) {
    socket.emit("joinError", {
      message: "Room does not exist",
    });
    return;
  }

  socket.join(data.roomId);
  socket.emit("joinSuccess", {
    sucess: true,
    roomId: data.roomId,
  });
  socket.to(data.roomId).emit("newJoin", { joinUser: data.user });
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token provided" });
    }

    const user = jwt.decode(token) as jwtTokenType | null;
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token type" });
    }

    const room = await PrivateChatRoom.findById(id);

    if (room?.owner.toString() === user.id.toString()) {
      await PrivateChatRoom.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ success: true, message: "Room Deleted Successfully." });
    }

    res
      .status(400)
      .json({ success: false, message: "Unauthorized delete access." });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong while deleting room.",
    });
  }
};
