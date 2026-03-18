import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";






class ChatService {

    async createChat(userid, title) {
        const chat = await ChatModel.create({
            user: userid,
            title: title
        })
        return chat
    }
    async UpdateChat(chatid, title) {
        const chat = await ChatModel.findByIdAndUpdate(chatid, {
            title: title
        })
        return chat
    }
    async createMessage(chatid, msg, role) {
        const data = await MessageModel.create({
            chat: chatid,
            content: msg,
            role: role
        })
        return data
    }
}




export const chatService = new ChatService();
