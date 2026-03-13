import ChatModel from "../models/chat.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createChat = asyncHandler(async (req, res) => {
    const chat = await ChatModel.create({
        user: req.user.id
    });
    res.status(200).json(new ApiResponse(200, chat, "Chat create Successfully"));
})

export const getUserChats = asyncHandler(async (req, res) => {
    const chats = await ChatModel.find({
        user: req.user.id
    }).sort({ updatedAt: -1 });

    res.status(200).json(new ApiResponse(200, chats, "Chats fetch Successfully"));
})

