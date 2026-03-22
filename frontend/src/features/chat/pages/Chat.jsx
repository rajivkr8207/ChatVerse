import React, { useEffect, useRef, useState } from 'react';
import {
  MessageCircle,
  Send,
  Menu,
  X,
} from 'lucide-react';
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import Sidebar from '../components/SideNavbar';
import useChat from '../hook/useChat';
import { useDispatch, useSelector } from 'react-redux';
import { addnewChat, addnewMessage, Setchatid, Setchatmessage } from '../chat.slice';
import socket from '../../../lib/socket/socket';
import TypingIndicator from '../components/TypingIndicator';
// import TypingText from '../../../animation/TypingText';
import { motion } from "framer-motion";
import { useParams } from 'react-router-dom';
const Chat = () => {

  const { chatid } = useParams();

  useEffect(() => {
    if (chatid) {
      dispatch(Setchatid(chatid));
      handleGetChatbyId(chatid);
    }
  }, [chatid]);



  const inputRef = useRef(null);
  const dispatch = useDispatch()
  const chats = useSelector(state => state.chat.chats)
  const userid = useSelector(state => state.auth.user)
  const [typing, setTyping] = useState(false);
  const chatID = useSelector(state => state.chat.chatId)
  const allchatchatID = useSelector(state => state.chat)

  const isloading = useSelector(state => state.chat.isloading)

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const messages = useSelector(state => state.chat.chatmessages)

  const { handleGetAllChat, handleGetChatbyId } = useChat()


  const chatIdRef = useRef(chatID);

  useEffect(() => {
    chatIdRef.current = chatID;
  }, [chatID]);

  useEffect(() => {
    handleGetAllChat()
  }, [])

  // const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // const toggleDarkMode = () => setDarkMode(!darkMode);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      const { aimesg, chat } = msg
      if (aimesg.chat == chatIdRef.current) {
        dispatch(addnewMessage(aimesg))
      }
      else {
        dispatch(Setchatid(aimesg.chat))
        dispatch(addnewChat(chat))
        dispatch(addnewMessage(aimesg))
      }
    });
    socket.on("typing", (status) => {
      setTyping(status);
    });
    socket.on("error", (err) => {
      console.error(err);
    });

    return () => {
      socket.off("receive_message");
      socket.off("error");
      socket.off("typing");
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    if (!value.trim()) return;
    console.log('chat data hai ', allchatchatID);
    let data
    if (chatID) {
      data = {
        message: value,
        chatid: chatID,
        userid: userid.id
      }
    } else {
      data = {
        message: value,
        userid: userid.id
      }
    }

    dispatch(addnewMessage({
      _id: "",
      chat: chatID || '',
      content: value,
      role: "user"
    }))

    setTimeout(scrollToBottom, 100);

    socket.emit("send_message", data);
    inputRef.current.value = "";
  };

  const startNewChat = () => {
    dispatch(Setchatmessage([]))
    dispatch(Setchatid(null))
  }

  const selectChat = (chatId) => {
    dispatch(Setchatid(chatId))
    handleGetChatbyId(chatId)
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    handleDeleteChat(chatId)
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  return (
    <>
      {/* Scrollable container with ref */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages?.map((msg) => (
          <div
            key={msg?.id || `${msg?.role}-${msg?.content}-${Date.now()}`}
            className={`flex ${msg?.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-[80%] lg:max-w-[70%] rounded-2xl p-4 shadow-sm ${msg?.role === 'user'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none'
                : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-bl-none border border-neutral-200/50 dark:border-neutral-700/50'
                }`}
            >
              {msg?.role === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <MessageCircle size={14} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">AI Assistant</span>
                </div>
              )}

              {msg?.role === 'user' ? (
                <p className="text-[15px] leading-relaxed font-medium">{msg?.content}</p>
              ) : (
                <motion.div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className='mb-3 last:mb-0 text-[15px] leading-relaxed'>{children}</p>,
                      ul: ({ children }) => <ul className='mb-3 space-y-1 list-disc pl-5'>{children}</ul>,
                      ol: ({ children }) => <ol className='mb-3 space-y-1 list-decimal pl-5'>{children}</ol>,
                      li: ({ children }) => <li className='text-[15px] leading-relaxed'>{children}</li>,
                      code: ({ children }) => <code className='rounded bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 font-mono text-sm text-pink-600 dark:text-pink-400'>{children}</code>,
                      pre: ({ children }) => <pre className='mb-3 overflow-x-auto rounded-xl bg-neutral-900 dark:bg-neutral-950 p-4 font-mono text-sm text-neutral-100'>{children}</pre>
                    }}
                    remarkPlugins={[remarkGfm]}
                  >
                    {msg?.content}
                  </ReactMarkdown>
                </motion.div>
              )}
              <p className="text-xs mt-2 opacity-60 text-right">
                {/* Timestamp can be added here if needed */}
              </p>
            </div>
          </div>
        ))}

        {typing && (
          <TypingIndicator />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-neutral-200/50 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            ref={inputRef}
            placeholder="Message AI Assistant..."
            className="flex-1 px-5 py-3 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-[15px] transition-all duration-200"
          />
          <button
            type="submit"
            disabled={isloading}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <Send size={18} />
            <span className="font-medium">
              {isloading ? 'Sending...' : 'Send'}
            </span>
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;