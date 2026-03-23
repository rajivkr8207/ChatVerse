import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            index: true,
        },
        title: {
            type: String,
            default: "new Chat",
            trim: true,
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        shareId: { type: String, unique: true, sparse: true },
    },
    {
        timestamps: true,
    }
);

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;
