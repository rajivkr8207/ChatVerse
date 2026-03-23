import express from 'express'
import { verifyUser } from '../middleware/auth.middleware.js'
import { ChatDeleteById, CreateNewChat, GetAllchat, GetChatById, makeChatPublic, searchChats, SendMessage } from '../controllers/chat.controller.js'

const ChatRouter = express.Router()


ChatRouter.post('/messages', verifyUser, SendMessage)
ChatRouter.get('/', verifyUser, GetAllchat)
ChatRouter.get('/search', verifyUser, searchChats)
ChatRouter.get('/:chatid', verifyUser, GetChatById)
ChatRouter.delete('/:chatid', verifyUser, ChatDeleteById)
ChatRouter.post('/new', verifyUser, CreateNewChat)
ChatRouter.post("/share/:chatId", verifyUser, makeChatPublic);

export default ChatRouter