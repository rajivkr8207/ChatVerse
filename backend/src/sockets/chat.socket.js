import { nanoid } from 'nanoid';
import MessageModel from '../models/message.model.js';
import { ChatGeminimessage, GenrateMessageTilte } from '../services/ai.server.js';
import { chatService } from '../services/chat.service.js';
import { chatRagService, queryEmbeddings } from '../services/rag.service.js';

export const handleSocketChat = (socket) => {
  socket.on('send_message', async (data, callback) => {
    let currentChatId = data?.chatid;
    try {
      const { message, chatid, userid, file } = data;
      let title = null;
      let chat = null;

      if (!chatid) {
        title = await GenrateMessageTilte(message);
        chat = await chatService.createChat(userid, title);
      }

      currentChatId = chatid || chat._id;

      await chatService.createMessage(currentChatId, message, 'user', userid);

      if (callback) {
        callback({
          chatId: currentChatId,
          chat,
        });
      }

      socket.emit('typing', { chatId: currentChatId, status: true });
      if (file) {
        const docid = nanoid();
        const response = await chatRagService(file, docid, userid, message);
        await chatService.UpdateChat(currentChatId, docid);
        const aimesg = await chatService.createMessage(
          currentChatId,
          response,
          'ai',
          userid,
          null,
          file,
        );
        socket.emit('typing', { chatId: currentChatId, status: false });
        socket.emit('receive_message', { chat, aimesg });

        return;
      }

      const chatData = await chatService.getChatById(currentChatId);
      let context = '';
      if (chatData?.chat?.activeDocumentId) {
        context = await queryEmbeddings(message, chatData.chat.activeDocumentId, userid);
      }

      const messages = await MessageModel.find({
        chat: currentChatId,
      }).sort({ createdAt: 1 });

      const formattedMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      if (context) {
        formattedMessages.unshift({
          role: 'ai',
          content: `Use this context to answer:\n${context}`,
        });
      }
      const airesponse = await ChatGeminimessage(formattedMessages);

      const aimesg = await chatService.createMessage(currentChatId, airesponse, 'ai', userid);
      socket.emit('typing', { chatId: currentChatId, status: false });
      socket.emit('receive_message', { chat, aimesg });
    } catch (err) {
      console.error(err);
      socket.emit('typing', { chatId: currentChatId, status: false });
      const status = err.statusCode || err.status || err.response?.status;
      const rateLimited = status === 429 || /\b429\b|rate.?limit/i.test(err.message || '');
      socket.emit('chat_error', {
        chatId: currentChatId,
        message: /GOOGLE_API_KEY|Google embedding request failed \((400|401|403)\)/i.test(
          err.message || '',
        )
          ? 'Document search is unavailable because the Google embedding API key is missing, invalid, or the embedding API is not enabled. Check GOOGLE_API_KEY and the Google Generative Language API configuration.'
          : rateLimited
            ? 'The AI service is temporarily rate limited. Please wait a little and try again.'
            : 'The AI could not generate a response. Please try again.',
      });
    }
  });
};
