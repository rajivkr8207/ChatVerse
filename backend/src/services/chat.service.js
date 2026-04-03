import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";

class ChatService {

    async createChat(userid, title) {
        const chat = await ChatModel.create({
            user: userid,
            title: title,
        })
        return chat
    }
    async UpdateChat(chatid, docid) {
        const chat = await ChatModel.findByIdAndUpdate(chatid, {
            activeDocumentId: docid
        })
        return chat
    }
    async createMessage(chatid, msg, role, userid) {
        const data = await MessageModel.create({
            user: userid,
            chat: chatid,
            content: msg,
            role: role
        })
        return data
    }
    async getChatById(id) {
        const chat = await ChatModel.findById(id).populate("user", "name").lean();
        if (!chat) {
            throw new Error("Chat not found");
        }
        return { chat };
    }
}


export const chatService = new ChatService();
