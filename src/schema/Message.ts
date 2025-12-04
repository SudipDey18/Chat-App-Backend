import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  senderMsg: string;
  reciverMsg:string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderMsg: {
      type: String,
      required: true,
    },
    reciverMsg: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);