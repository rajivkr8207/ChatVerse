import { useEffect, useRef, useState } from 'react';
import {
  MessageCircle,
  Send,
} from 'lucide-react';
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import useChat from '../hook/useChat';
import { useDispatch, useSelector } from 'react-redux';
import { addnewChat, addnewMessage, Setchatid, Setchatmessage } from '../chat.slice';
import socket from '../../../lib/socket/socket';
import TypingIndicator from '../components/TypingIndicator';
import { motion } from "framer-motion";
import { useNavigate, useParams } from 'react-router-dom';
const Chat = () => {

  const { chatid } = useParams();

  useEffect(() => {
    if (chatid) {
      dispatch(Setchatid(chatid));
      handleGetChatbyId(chatid);
    }
  }, [chatid]);



  const dispatch = useDispatch()
  const [typing, setTyping] = useState(false);
  const chatID = useSelector(state => state.chat.chatId)

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
  const navigate = useNavigate()

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
        navigate(`/chat/${aimesg.chat}`)
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  return (
    <>
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
                <motion.div initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-sm dark:prose-invert max-w-none">
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

    </>
  );
};

export default Chat;