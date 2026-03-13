import express from 'express'
import { verifyUser } from '../middleware/auth.middleware.js'
import { createChat, getUserChats } from '../controllers/chat.controller.js'

const ChatRouter = express.Router()


ChatRouter.post('/',verifyUser, createChat)
ChatRouter.get('/',verifyUser, getUserChats)


export default ChatRouter