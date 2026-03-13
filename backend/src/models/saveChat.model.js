import mongoose from "mongoose";

const SaveChatSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: [true, "chat is required"],
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "user is required"],
            index: true,
        },
           
    },
    {
        timestamps: true,
    }
);

const SaveChatModel = mongoose.model("Message", SaveChatSchema);

export default SaveChatModel;
