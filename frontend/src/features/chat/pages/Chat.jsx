import { useEffect, useRef } from 'react';
import { ChessKing, MessageCircle } from 'lucide-react';
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

const Chat = () => {

  const { chatid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);

  const messages = chats[activeChatId]?.messages || [];
  const typing = chats[activeChatId]?.typing || false;

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

    socket.on("error", (err) => {
      console.error(err);
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("error");
    };
  }, [chats]);

  // ✅ auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
      {messages
        .filter(msg => msg && msg.content)   // 🔥 IMPORTANT
        .map((msg) => {
          const role = msg?.role || "ai";

          return (
            <div
              key={msg._id || `${role}-${msg.content}`}
              className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] lg:max-w-[70%] rounded-2xl p-4 ${role === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border'
                  }`}
              >

                {role === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={14} />
                    <span className="text-xs">AI Assistant</span>
                  </div>
                )}

                {role === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                )}

              </div>
            </div>
          );
        })}

      {typing && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chat;