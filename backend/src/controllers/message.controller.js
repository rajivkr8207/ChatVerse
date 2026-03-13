import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import { ChatGeminimessage } from "../services/google.server.js";




export const sendMessage = async (req, res) => {
    const { chatId, message } = req.body;
    const chat = await ChatModel.findById(chatId);

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        });
    }

    if (chat.user !== req.user.id) {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    const userMessage = await MessageModel.create({
        chat: chatId,
        role: "user",
        content: message
    });

    const history = await MessageModel.find({
        chat: chatId
    }).sort({ createdAt: 1 });

    const formatted = history.map(m => ({
        role: m.role,
        content: m.content
    }));

    const aiResponse = await ChatGeminimessage(formatted);

    const aiMessage = await MessageModel.create({
        chat: chatId,
        role: "ai",
        content: aiResponse
    });

    return res.status(200).json({
        success: true,
        messages: [userMessage, aiMessage]
    });

};