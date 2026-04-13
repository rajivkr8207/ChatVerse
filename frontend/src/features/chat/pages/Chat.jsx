import { useEffect, useRef } from 'react';
import { MessageCircle, User as UserIcon } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import useChat from '../hook/useChat';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNewChat,
  addMessage,
  setActiveChat,
  setTyping,
  removeAllTempChats,
} from '../chat.slice';
import socket from '../../../lib/socket/socket';
import TypingIndicator from '../components/TypingIndicator';
import { useNavigate, useParams } from 'react-router-dom';
import Typewriter from '../../../components/common/Typewriter';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const { chatid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);

  const messages = chats[activeChatId]?.messages || [];
  const typing = chats[activeChatId]?.typing || false;
  const isLatestAI = useRef(false);
  const messagesEndRef = useRef(null);
  const chatIdRef = useRef(activeChatId);

  const { handleGetAllChat, handleGetChatbyId } = useChat();

  useEffect(() => {
    chatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (chatid) {
      dispatch(setActiveChat(chatid));
      if (!chatid.startsWith('temp')) {
        handleGetChatbyId(chatid);
      }
    }
  }, [chatid]);

  useEffect(() => {
    handleGetAllChat();
  }, []);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (!msg?.aimesg || !msg?.aimesg?.content) return;
      const chatId = msg.aimesg.chat;
      dispatch(removeAllTempChats());
      if (!chats[chatId]) {
        dispatch(addNewChat(msg.chat));
      }
      isLatestAI.current = true;
      dispatch(addMessage({
        chatId,
        message: msg.aimesg,
      }));

      dispatch(setTyping({ chatId: chatId, typing: false }));

      if (!chatIdRef.current) {
        dispatch(setActiveChat(chatId));
        navigate(`/chat/${chatId}`);
      }
    });
    
    socket.on("typing", ({ chatId, status }) => {
      dispatch(setTyping({ chatId, typing: status }));
    });
    
    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [chats]);

  useEffect(() => {
    isLatestAI.current = false;
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <AnimatePresence initial={false}>
          {messages
            .filter(msg => msg && msg.content)
            .map((msg, index) => {
              const role = msg?.role || "ai";
              const isLastmsg = role === 'ai' && index === messages.length - 1;
              const isAI = role === 'ai';

              return (
                <motion.div
                  key={msg._id || `${role}-${msg.content}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex ${isAI ? 'justify-start' : 'justify-end'} group`}
                >
                  <div className={`flex gap-4 max-w-[90%] md:max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                      isAI ? 'bg-primary/10 text-primary' : 'bg-neutral-800 text-white'
                    }`}>
                      {isAI ? <MessageCircle size={16} /> : <UserIcon size={16} />}
                    </div>

                    <div className={`space-y-1 ${isAI ? 'items-start' : 'items-end'} flex flex-col min-w-0 max-w-full flex-1 overflow-hidden`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                        {isAI ? 'AI Assistant' : 'You'}
                      </span>
                      
                      <div className={`rounded-2xl px-4 md:px-5 py-3 text-sm md:text-base leading-relaxed shadow-sm break-words max-w-full overflow-hidden ${
                        isAI 
                          ? 'bg-card text-card-foreground border border-border' 
                          : 'bg-primary text-white shadow-lg shadow-primary/20'
                      }`} style={{ overflowWrap: 'anywhere' }}>
                        {isAI ? (
                          isLastmsg && isLatestAI.current ? (
                            <Typewriter text={msg.content} onComplete={() => isLatestAI.current = false} />
                          ) : (
                            <div className="markdown-container prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-full overflow-x-auto custom-scrollbar">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          )
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>

        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};

export default Chat;