import React, { useEffect, useState } from 'react';
import {
  MessageCircle,
  Send,
  Menu,
  X,
  Plus,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Trash2,
  Edit3
} from 'lucide-react';
import Sidebar from '../components/SideNavbar';
import useChat from '../hook/useChat';
import { useSelector } from 'react-redux';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'ai', timestamp: new Date() }
  ]);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Getting started with React', active: true },
    { id: 2, title: 'JavaScript concepts discussion', active: false },
    { id: 3, title: 'Project ideas for portfolio', active: false },
    { id: 4, title: 'Debugging help needed', active: false },
  ]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm here to help. Feel free to ask me anything about coding, general knowledge, or just chat!",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const startNewChat = () => {
    setMessages([
      { id: 1, text: 'Hello! How can I help you today?', sender: 'ai', timestamp: new Date() }
    ]);
    // Add to chat history
    const newChat = {
      id: chatHistory.length + 1,
      title: 'New conversation',
      active: true
    };
    setChatHistory([newChat, ...chatHistory.map(ch => ({ ...ch, active: false }))]);
  };

  const selectChat = (chatId) => {
    setChatHistory(chatHistory.map(chat => ({
      ...chat,
      active: chat.id === chatId
    })));
    // In a real app, you'd load the messages for this chat
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatHistory(chatHistory.filter(chat => chat.id !== chatId));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const chat = useChat()

  // const user  = useSelector((state)=> state.auth.user)

  useEffect(() => {
    chat.initializeSocketconnection()
  }, [])

  return (
    <div className={`h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} darkMode={darkMode} startNewChat={startNewChat} chatHistory={chatHistory} selectChat={selectChat} deleteChat={deleteChat} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-4"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            AI Assistant
          </h1>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle size={16} className="text-blue-500" />
                    <span className="text-xs font-semibold">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Send size={18} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;