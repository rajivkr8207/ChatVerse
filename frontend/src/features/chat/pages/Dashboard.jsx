import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  Send,
  X,
} from 'lucide-react';
import Sidebar from '../components/SideNavbar';
import useChat from '../hook/useChat';
import { useDispatch, useSelector } from 'react-redux';
import { addnewChat, addnewMessage, Setchatid, Setchatmessage, SetTyping } from '../chat.slice';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import socket from '../../../lib/socket/socket';
import ChatSearchLanding from '../components/ChatSearchLanding';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const pathname = location.pathname;
  const inputRef = useRef(null);
  // const chats = useSelector(state => state.chat.chats)
  const chatID = useSelector(state => state.chat.chatId)
  const userid = useSelector(state => state.auth.user)
  const messages = useSelector(state => state.chat.chatmessages)
  const typing = useSelector(state => state.chat.typing)

  const { handleGetAllChat, setPage, handleDeleteChat, handleGetChatbyId, page, hasMore, loadingMore, } = useChat()
  const messagesEndRef = useRef(null);

  const chatIdRef = useRef(chatID);
  const searching = useSelector(state => state.chat.searching)
  useEffect(() => {
    chatIdRef.current = chatID;
  }, [chatID]);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const handleSendMessage = (e, msgtext) => {
    e.preventDefault();
    const value = msgtext || inputRef.current.value;
    if (!value.trim()) return;
    const tempChatId = chatID || `temp-${Date.now()}`;
    const isNewChat = !chatID;

    const data = {
      message: value,
      chatid: chatID || null,
      userid: userid.id
    };
    if (isNewChat) {
      navigate(`/chat/${tempChatId}`); // 🚀 INSTANT REDIRECT
    }
    dispatch(addnewMessage({
      _id: Date.now(),
      chat: tempChatId,
      content: value,
      role: "user"
    }));

    dispatch(SetTyping(true));


    socket.emit("send_message", data, (response) => {
      // 👇 IMPORTANT: backend should send ack
      const { chatId, chat, aimesg } = response;

      if (isNewChat && chatId) {
        dispatch(Setchatid(chatId));
        dispatch(addnewChat(chat));
        navigate(`/chat/${chatId}`);  // 🔥 MAIN FIX
      }

      if (
        aimesg.chat == chatIdRef.current ||
        chatIdRef.current?.startsWith("temp")
      ) {
        dispatch(addnewMessage(aimesg))
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
      <Sidebar toggleSidebar={toggleSidebar} setPage={setPage} page={page} hasMore={hasMore} loadingMore={loadingMore} sidebarOpen={sidebarOpen} handleGetAllChat={handleGetAllChat} darkMode={darkMode} startNewChat={startNewChat} selectChat={selectChat} deleteChat={deleteChat} toggleDarkMode={toggleDarkMode} />
      {searching && <ChatSearchLanding />}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <header className="border-b border-neutral-200/50 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-4 flex items-center sticky top-0 z-10">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 mr-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
          >
            {!sidebarOpen && <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
            ChatVerse
          </h1>
        </header>

        <Outlet />

        <div className="my-auto  rounded-lg dark:border-neutral-700/50  backdrop-blur-sm p-4">
          {/* Heading */}
          {pathname == '/' &&
            <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-white">
              What do you want to know?
            </h1>
          }
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              ref={inputRef}
              placeholder="Message AI Assistant..."
              className="flex-1 px-5 py-3 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-[15px] transition-all duration-200"
            />
            <button
              type="submit"
              disabled={typing}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <Send size={18} />
              <span className="font-medium">
                {typing ? 'proccessing...' : 'Send'}
              </span>
            </button>
          </form>
          {/* Suggestions */}
          {pathname == '/' &&
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                "Explain system design",
                "Build a chat app",
                "Best startup ideas",
                "Learn React fast",
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={(e)=>handleSendMessage(e, item)}
                  className="px-4 py-2 rounded-full bg-white/5 border text-white border-white/10 text-sm hover:bg-white/10 transition"
                >
                  {item}
                </button>
              ))}
            </div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;