import mongoose, { Schema, Document } from "mongoose";

export interface IChatRoom extends Document {
    participants: mongoose.Types.ObjectId[];
    messages: mongoose.Types.ObjectId[];
    isGroup: boolean;
}

const ChatRoomSchema: Schema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
                default: []
            },
        ],
        isGroup: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", ChatRoomSchema);
