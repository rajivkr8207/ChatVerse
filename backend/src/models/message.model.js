import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: [true, "User is required"],
            index: true,
        },
        content: {
            type: String,
            required: [true, "content is required"],
        },
        role: {
            type: String,
            enum: ['user', 'ai'],
            required: [true, "Title is required"],
        },
    },
    {
        timestamps: true,
    }
);

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
