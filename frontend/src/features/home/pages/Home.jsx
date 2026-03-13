// App.jsx
import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bookmark,
  Share2,
  ThumbsUp,
  Copy,
  ExternalLink
} from 'lucide-react';
import Sidebar from '../components/SIdebar';
import Header from '../components/Header';
import SearchItem from '../components/SearchItem';
import socket from '../../../lib/socket/socket';
import { useEffect } from 'react';

const HomePage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([
    { id: 1, title: 'What is machine learning?', time: '2 hours ago', active: true },
    { id: 2, title: 'React vs Vue comparison', time: 'Yesterday', active: false },
    { id: 3, title: 'Best practices for UI design', time: '2 days ago', active: false },
    { id: 4, title: 'Understanding TypeScript', time: '3 days ago', active: false },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const [suggestedQuestions] = useState([
    'What are the applications of ML?',
    'How to start learning ML?',
    'Best ML frameworks 2024',
    'ML vs Deep Learning difference'
  ]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const createNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: 'New conversation',
      time: 'Just now',
      active: true
    };
    setChats([newChat, ...chats.map(c => ({ ...c, active: false }))]);
    setActiveChat(newChat.id);
    setMessages([]);
  };
  const chatId = "123";
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    socket.emit("user_message", {
      chatId,
      message: searchQuery
    });


    setSearchQuery('');

  };

  useEffect(() => {

    socket.on("new_message", (msg) => {

      setMessages(prev => [...prev, msg]);

    });

  }, []);

  return (
    <div className={`h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>

      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} createNewChat={createNewChat} chats={chats} setActiveChat={setActiveChat} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <Header activeChat={activeChat} chats={chats} />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">

            {messages.length === 0 ? (
              // Welcome Screen
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Welcome to Nova AI
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Your intelligent assistant for answers and insights
                </p>

                {/* Suggested Questions */}
                <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(question)}
                      className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition text-left text-sm text-gray-700 dark:text-gray-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Chat Messages
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${message.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800'} rounded-2xl p-4 shadow-sm`}>

                    {/* Message Content */}
                    <div className="prose dark:prose-invert max-w-none">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className={message.type === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}>
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* Sources for AI responses */}
                    {message.sources && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, index) => (
                            <a
                              key={index}
                              href={source.url}
                              className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full transition"
                            >
                              {source.title}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message Footer */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs opacity-70">{message.timestamp}</span>
                      {message.type === 'assistant' && (
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                            <ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <SearchItem handleSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </div>
  );
};

export default HomePage;