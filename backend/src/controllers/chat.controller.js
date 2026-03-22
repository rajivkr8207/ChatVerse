import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import { ChatGeminimessage, GenrateMessageTilte } from "../services/ai.server.js";
import { chatService } from "../services/chat.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const SendMessage = asyncHandler(async (req, res) => {
    const { message, chatid } = req.body;
    const userid = req.user.id;
    let title = null;
    let chat = null;
    if (!chatid) {
        title = await GenrateMessageTilte(message);
        chat = await chatService.createChat(userid, title);
    }
    const currentChatId = chatid || chat._id;

    const usermsg = await chatService.createMessage(currentChatId, message, 'user');

    const allmsg = await MessageModel.find({ chat: currentChatId });

    const airesponse = await ChatGeminimessage(allmsg);

    const aimesg = await chatService.createMessage(currentChatId, airesponse, 'ai');

    res.status(200).json(
        new ApiResponse(200, { usermsg, title, chat, aimesg }, "Chat create Successfully")
    );
});

export const CreateNewChat = asyncHandler(async (req, res) => {
    const userid = req.user.id
    const chat = await chatService.createChat(userid, "New chat")
    res.status(201).json(new ApiResponse(201, { chat }, "Chat create Successfully"));
})

export const GetAllchat = asyncHandler(async (req, res) => {
    const userid = req.user.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const allchat = await ChatModel.find({ user: userid })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })

    const totalChats = await ChatModel.countDocuments({ user: userid })

    res.status(200).json(new ApiResponse(200, {
        chats: allchat,
        pagination: {
            page,
            limit,
            total: totalChats,
            totalPages: Math.ceil(totalChats / limit)
        }
    }))
})



export const GetChatById = asyncHandler(async (req, res) => {
    const chatid = req.params.chatid
    const chatmsg = await MessageModel.find({
        chat: chatid
    })
    res.status(200).json(new ApiResponse(200, { chatmsg }))
})


export const ChatDeleteById = asyncHandler(async (req, res) => {
    const chatid = req.params.chatid
    const chat = await ChatModel.findOneAndDelete({
        _id: chatid,
        user: req.user.id
    })
    await MessageModel.deleteMany({
        chat: chatid
    })
    if (!chat) {
        return res.status(400).json(new ApiError(400, "Chat not found"))
    }
    res.status(200).json(new ApiResponse(200, "Chat deleted successfully"))
})