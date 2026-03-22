import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  Send,
  X,
} from 'lucide-react';
import Sidebar from '../components/SideNavbar';
import useChat from '../hook/useChat';
import { useDispatch, useSelector } from 'react-redux';
import { addnewChat, addnewMessage, Setchatid, Setchatmessage } from '../chat.slice';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import socket from '../../../lib/socket/socket';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const pathname = location.pathname;
  const chats = useSelector(state => state.chat.chats)
  const chatID = useSelector(state => state.chat.chatId)
  const inputRef = useRef(null);
  const userid = useSelector(state => state.auth.user)
  const messages = useSelector(state => state.chat.chatmessages)
  const isloading = useSelector(state => state.chat.isloading)

  const { handleGetAllChat, handleDeleteChat, handleGetChatbyId } = useChat()
  const messagesEndRef = useRef(null);

  const chatIdRef = useRef(chatID);

  useEffect(() => {
    chatIdRef.current = chatID;
  }, [chatID]);

  useEffect(() => {
    handleGetAllChat()
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    if (!value.trim()) return;

    const isNewChat = !chatID;

    const data = {
      message: value,
      chatid: chatID || null,
      userid: userid.id
    };

    // optimistic UI
    dispatch(addnewMessage({
      _id: Date.now(),
      chat: chatID || '',
      content: value,
      role: "user"
    }));

    socket.emit("send_message", data, (response) => {
      // 👇 IMPORTANT: backend should send ack
      const { chatId, chat, aimesg } = response;

      if (isNewChat && chatId) {
        dispatch(Setchatid(chatId));
        dispatch(addnewChat(chat));
        navigate(`/chat/${chatId}`);  // 🔥 MAIN FIX
      }

      if (aimesg) {
        dispatch(addnewMessage(aimesg));
      }
    });

    inputRef.current.value = "";
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const startNewChat = () => {
    dispatch(Setchatmessage([]))
    dispatch(Setchatid(null))
    navigate('/')
  }

  const selectChat = (chatId) => {
    dispatch(Setchatid(chatId))
    handleGetChatbyId(chatId)
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    const path = (pathname.split('/')[2]);
    if (path == chatId) {
      dispatch(Setchatmessage([]))
      dispatch(Setchatid(null))
      navigate('/')
    }
    handleDeleteChat(chatId)
  };


  return (
    <div className={`h-screen flex ${darkMode ? 'dark' : ''}`}>
      <Sidebar sidebarOpen={sidebarOpen} darkMode={darkMode} startNewChat={startNewChat} chatHistory={chats} selectChat={selectChat} deleteChat={deleteChat} toggleDarkMode={toggleDarkMode} />

      <div className="flex-1 flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <header className="border-b border-neutral-200/50 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-4 flex items-center sticky top-0 z-10">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 mr-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
           ChatVerse
          </h1>
        </header>

        <Outlet />

        <div className="my-auto  rounded-lg dark:border-neutral-700/50  backdrop-blur-sm p-4">
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
      </div>
    </div>
  );
};

export default Dashboard;