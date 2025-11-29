import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  mobileNo: string;
  name: string;
  username: string;
  otp: string;
  expiry: Date;
  isVerified: boolean;
  socketId: string;
}

const UserSchema: Schema = new Schema(
  {
    mobileNo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    otp: {
      type: String,
      required: false,
    },
    expiry: {
      type: Date,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
