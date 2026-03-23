import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import { ChatGeminimessage, GenrateMessageTilte } from "../services/ai.server.js";
import { chatService } from "../services/chat.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { nanoid } from "nanoid";

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
    const { chatid } = req.params;
    const userid = req.user.id;

    const chat = await ChatModel.findById(chatid);

    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    const isOwner = chat.user.toString() === userid;
    const isPublic = chat.ispublic;

    if (!isOwner && !isPublic) {
        throw new ApiError(403, "You are not allowed to access this chat");
    }

    const messages = await MessageModel.find({
        chat: chatid
    }).sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, { chat, messages }, "Chat fetched successfully")
    );
});

export const searchChats = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const userId = req.user.id;
    if (!q || !q.trim()) {
        throw new ApiError(400, "Search query is required");
    }

    const regex = new RegExp(q, "i");

    const chatsByTitle = await ChatModel.find({
        user: userId,
        title: { $regex: regex }
    }).lean();

    const messages = await MessageModel.find({
        user: userId,
        content: { $regex: regex },
        role: 'user'
    })
        .populate("chat", "title")
        .lean();
    const chatsFromMessages = messages.map(msg => ({
        _id: msg.chat._id,
        title: msg.chat.title,
        preview: msg.content
    }));

    const map = new Map();

    chatsByTitle.forEach(chat => {
        map.set(chat._id.toString(), {
            _id: chat._id,
            title: chat.title,
            preview: null
        });
    });

    chatsFromMessages.forEach(chat => {
        if (!map.has(chat._id.toString())) {
            map.set(chat._id.toString(), chat);
        }
    });

    const results = Array.from(map.values());

    return res.status(200).json(
        new ApiResponse(200, results, "Search results fetched successfully")
    );
});



export const makeChatPublic = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await ChatModel.findOne({ _id: chatId, user: userId });

    if (!chat) {
        return res.status(404).json({ msg: "Chat not found" });
    }

    if (!chat.shareId) {
        chat.shareId = nanoid(10);
    }

    chat.isPublic = true;
    await chat.save();
    const shareUrl = `${config.FRONTEND_URL}/share/${chat.shareId}`
    return res.status(200).json(new ApiResponse(200, shareUrl, "Chat is now public"));
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
        return res.status(400).json(new ApiError(400, "ChatModel not found"))
    }
    res.status(200).json(new ApiResponse(200, "Chat deleted successfully"))
})