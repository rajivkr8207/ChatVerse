import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import useChat from '../hook/useChat';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMessage,
  setActiveChat,
  setTyping
} from '../chat.slice';
import socket from '../../../lib/socket/socket';
import TypingIndicator from '../components/TypingIndicator';
import { useParams } from 'react-router-dom';

const SharingChat = () => {

  const { chatid } = useParams();
  const dispatch = useDispatch();

  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);

  const messages = chats[activeChatId]?.messages || [];
  const typing = chats[activeChatId]?.typing || false;

  const messagesEndRef = useRef(null);
  const chatIdRef = useRef(activeChatId);

  const { handleGetAllChat, handleGetShareChat } = useChat();

  useEffect(() => {
    chatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (chatid) {
      dispatch(setActiveChat(chatid));
      handleGetShareChat(chatid);
    }
  }, [chatid]);

  useEffect(() => {
    handleGetAllChat();
  }, []);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      const { aimesg } = msg;
      const chatId = aimesg.chat;

      if (chatId === chatIdRef.current) {
        dispatch(addMessage({
          chatId,
          message: aimesg
        }));
      }
    });

    socket.on("typing", ({ chatId, status }) => {
      dispatch(setTyping({ chatId, typing: status }));
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {messages.map((msg) => (
        <div
          key={msg._id || `${msg.role}-${msg.content}`}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] lg:max-w-[70%] rounded-2xl p-4 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border'
            }`}
          >

            {msg.role === 'ai' && (
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={14} className="text-orange-500" />
                <span className="text-xs font-medium text-orange-500">
                  AI Assistant
                </span>
              </div>
            )}

            {msg.role === 'user' ? (
              <p>{msg.content}</p>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            )}

          </div>
        </div>
      ))}

      {typing && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default SharingChat;