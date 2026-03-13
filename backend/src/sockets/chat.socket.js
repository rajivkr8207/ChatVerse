import { socketAuth } from "../middleware/socketAuth.js";
import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import { ChatGeminimessage } from "../services/google.server.js";


export const chatSocket = (io) => {
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("User connected", socket.user?.id);
        socket.on("join_chat", (chatId) => {
            socket.join(chatId);
        });

        socket.on("send_message", async (data) => {
            const { chatId, message } = data;
            const chat = await ChatModel.findById(chatId);

            if (!chat) return;

            if (chat.user.toString() !== socket.user.id.toString()) {
                return;
            }

            const userMsg = await MessageModel.create({
                chat: chatId,
                role: "user",
                content: message
            });

            io.to(chatId).emit("new_message", userMsg);


            const history = await MessageModel.find({ chat: chatId })
                .sort({ createdAt: 1 });
            const formatted = history.map(m => ({
                role: m.role,
                content: m.content
            }));
            const response = await ChatGeminimessage(formatted);
            const aiMsg = await MessageModel.create({
                chat: chatId,
                role: "ai",
                content: response
            });
            io.to(chatId).emit("new_message", aiMsg);
        });
    });
};