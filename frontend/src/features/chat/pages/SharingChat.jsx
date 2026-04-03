import { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import socket from '../../../lib/socket/socket';
import TypingIndicator from '../components/TypingIndicator';
import { useParams } from 'react-router-dom';
import useChat from '../hook/useChat';
const SharingChat = () => {
  const { chatid } = useParams();

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const { handleGetShareChat } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await handleGetShareChat(chatid);
        setMessages(res.data);
        setChatId(res.data[0].chatId);
      } catch (err) {
        console.error(err);
      }
    };

    if (chatid) fetchChat();
  }, [chatid]);

  useEffect(() => {
    const handleReceive = (msg) => {
      const { aimesg } = msg;

      if (aimesg.chat === chatId) {
        setMessages(prev => [...prev, aimesg]);
      }
    };

    const handleTyping = ({ chatId: incomingChatId, status }) => {
      if (incomingChatId === chatId) {
        setTyping(status);
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[80%] lg:max-w-[70%] rounded-2xl p-4 ${msg.role === 'user'
              ? 'bg-orange-500 text-white'
              : 'bg-white dark:bg-neutral-800 border text-white'
            }`}>

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