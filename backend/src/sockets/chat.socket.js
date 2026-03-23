import MessageModel from "../models/message.model.js";
import { ChatGeminimessage, GenrateMessageTilte } from "../services/ai.server.js";
import { chatService } from "../services/chat.service.js";

export const handleSocketChat = (socket) => {
    socket.on("send_message", async (data,callback) => {
        try {
            const { message, chatid, userid } = data;
            let title = null;
            let chat = null;

            if (!chatid) {
                title = await GenrateMessageTilte(message);
                chat = await chatService.createChat(userid, title);
            }

            const currentChatId = chatid || chat._id;

            await chatService.createMessage(
                currentChatId,
                message,
                "user",userid
            );

            if (callback) {
                callback({
                    chatId: currentChatId,
                    chat
                });
            }

            socket.emit("typing", true);
            const allmsg = await MessageModel.find({ chat: currentChatId });
            const airesponse = await ChatGeminimessage(allmsg);

            const aimesg = await chatService.createMessage(
                currentChatId,
                airesponse,
                "ai",
                userid
            );
            socket.emit("typing", false);
            socket.emit("receive_message", {chat, aimesg});

        } catch (err) {
            console.error(err);
            socket.emit("error", "Something went wrong");
        }
    });
};