import React, { useEffect, useState } from 'react';
import {
  MessageCircle,
  Send,
  Menu,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown'
import Sidebar from '../components/SideNavbar';
import useChat from '../hook/useChat';
import { useDispatch, useSelector } from 'react-redux';
import { Setchatid, Setchatmessage } from '../chat.slice';
import { toast } from 'react-toastify';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch()
  const chats = useSelector(state => state.chat.chats)
  const chatID = useSelector(state => state.chat.chatId)
  const isloading = useSelector(state => state.chat.isloading)




  const messages = useSelector(state => state.chat.chatmessages)


  const { handleGetAllChat, handleDeleteChat, handleCreatechat, handleGetChatbyId, handleSendMessageApi } = useChat()
  useEffect(() => {
    handleGetAllChat()
  }, [])


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    let data
    if (chatID) {
      data = {
        message: message,
        chatid: chatID
      }
    } else {
      data = {
        message: message,
      }
    }
    handleSendMessageApi(data)
    setMessage('')
  };

  const startNewChat = () => {
    if (chats[0]?.title == "New chat") {
      toast.error(`new chat already exist`);
      return
    }
    dispatch(Setchatmessage([]))
    dispatch(Setchatid(null))
    handleCreatechat()
  }

  const selectChat = (chatId) => {
    dispatch(Setchatid(chatId))
    handleGetChatbyId(chatId)
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    handleDeleteChat(chatId)
  };


  const chat = useChat()


  useEffect(() => {
    chat.initializeSocketconnection()
  }, [])

  return (
<div className={`h-screen flex ${darkMode ? 'dark' : ''}`}>
  {/* Sidebar */}
  <Sidebar sidebarOpen={sidebarOpen} darkMode={darkMode} startNewChat={startNewChat} chatHistory={chats} selectChat={selectChat} deleteChat={deleteChat} toggleDarkMode={toggleDarkMode} />

  {/* Main Content */}
  <div className="flex-1 flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
    {/* Header */}
    <header className="border-b border-neutral-200/50 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-4 flex items-center sticky top-0 z-10">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 mr-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <h1 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
        AI Assistant
      </h1>
    </header>

    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
      {messages?.map((msg) => (
        <div
          key={msg?.id}
          className={`flex ${msg?.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
        >
          <div
            className={`max-w-[80%] lg:max-w-[70%] rounded-2xl p-4 shadow-sm ${
              msg?.role === 'user'
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
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className='mb-3 last:mb-0 text-[15px] leading-relaxed'>{children}</p>,
                    ul: ({ children }) => <ul className='mb-3 space-y-1 list-disc pl-5'>{children}</ul>,
                    ol: ({ children }) => <ol className='mb-3 space-y-1 list-decimal pl-5'>{children}</ol>,
                    li: ({ children }) => <li className='text-[15px] leading-relaxed'>{children}</li>,
                    code: ({ children }) => <code className='rounded bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 font-mono text-sm text-pink-600 dark:text-pink-400'>{children}</code>,
                    pre: ({ children }) => <pre className='mb-3 overflow-x-auto rounded-xl bg-neutral-900 dark:bg-neutral-950 p-4 font-mono text-sm text-neutral-100'>{children}</pre>
                  }}
                >
                  {msg?.content}
                </ReactMarkdown>
              </div>
            )}
            <p className="text-xs mt-2 opacity-60 text-right">
              {/* Timestamp can be added here if needed */}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Message Input */}
    <div className="border-t border-neutral-200/50 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-4">
      <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
  </div>
</div>
  );
};

export default Home;