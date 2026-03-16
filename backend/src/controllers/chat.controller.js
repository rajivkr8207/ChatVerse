import ChatModel from "../models/chat.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const SendMessage = asyncHandler(async (req, res) => {
    const {message} = req.body;
    const chat = await ChatModel.create({
        user: req.user.id
    });
    res.status(200).json(new ApiResponse(200, chat, "Chat create Successfully"));
})
