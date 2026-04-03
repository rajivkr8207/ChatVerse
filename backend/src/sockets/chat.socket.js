import { nanoid } from 'nanoid'
import MessageModel from "../models/message.model.js";
import { ChatGeminimessage, GenrateMessageTilte } from "../services/ai.server.js";
import { chatService } from "../services/chat.service.js";
import { chatRagService, queryEmbeddings } from '../services/rag.service.js';

export const handleSocketChat = (socket) => {
    socket.on("send_message", async (data, callback) => {
        try {
            const { message, chatid, userid, file } = data;
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
                "user",
                userid
            );

            if (callback) {
                callback({
                    chatId: currentChatId,
                    chat
                });
            }

            socket.emit("typing", true);
            if (file) {
                const docid = nanoid();
                const response = await chatRagService(file, docid, userid, message)
                await chatService.UpdateChat(currentChatId, docid);
                const aimesg = await chatService.createMessage(
                    currentChatId,
                    response,
                    "ai",
                    userid,
                    null,
                    file
                );
                socket.emit("typing", false);
                socket.emit("receive_message", { chat, aimesg });

                return;
            }

            const chatData = await chatService.getChatById(currentChatId);
            let context = ""
            if (chatData?.activeDocumentId) {
                context = await queryEmbeddings(
                    message,
                    chatData.activeDocumentId,
                    userid
                );
            }

            const messages = await MessageModel.find({
                chat: currentChatId
            }).sort({ createdAt: 1 });

            const formattedMessages = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            if (context) {
                formattedMessages.unshift({
                    role: "ai",
                    content: `Use this context to answer:\n${context}`
                });
            }

            const airesponse = await ChatGeminimessage(formattedMessages);

            const aimesg = await chatService.createMessage(
                currentChatId,
                airesponse,
                "ai",
                userid
            );
            socket.emit("typing", false);
            socket.emit("receive_message", { chat, aimesg });

        } catch (err) {
            console.error(err);
            socket.emit("error", "Something went wrong");
        }
    });
};