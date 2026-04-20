import mongoose, { Schema, Document } from "mongoose";

export interface IPrivateChatRoom extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
}

const PrivateChatRoomSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
});

export const PrivateChatRoom = mongoose.model<IPrivateChatRoom>(
  "PrivateChatRoom",
  PrivateChatRoomSchema,
);
