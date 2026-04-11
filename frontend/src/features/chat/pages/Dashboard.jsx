import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  Send,
  Share,
  X,
  FilePlusCorner,
} from 'lucide-react';
import Sidebar from '../components/SideNavbar';
import useChat from '../hook/useChat';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNewChat,
  addMessage,
  setActiveChat,
  setTyping,
  setSharing,
} from "../chat.slice";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import socket from '../../../lib/socket/socket';
import ChatSearchLanding from '../components/ChatSearchLanding';
import Button from '../../../components/common/Button';
import ShareChat from '../components/ShareChat'
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const pathname = location.pathname;
  const pathid = `${window.location.pathname.split('/')[1]}`
  const deleteid = `${window.location.pathname.split('/')[2]}`

  const inputRef = useRef(null);
  const userid = useSelector(state => state.auth.user)

  const sharing = useSelector(state => state.chat.sharing)

  const activeChatId = useSelector(state => state.chat.activeChatId)
  const chats = useSelector(state => state.chat.chats)

  const messages = chats[activeChatId]?.messages || []
  const typing = chats[activeChatId]?.typing || false
  const { handleGetAllChat, setPage, handleDeleteChat, handleGetChatbyId, page, hasMore, loadingMore, } = useChat()
  const messagesEndRef = useRef(null);

  const chatIdRef = useRef(activeChatId);
  const searching = useSelector(state => state.chat.searching)
  useEffect(() => {
    chatIdRef.current = activeChatId;
  }, [activeChatId]);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const handleSendMessage = (e, msgtext) => {
    e.preventDefault();
    const value = msgtext || inputRef.current.value;
    if (!value.trim()) return;

    const tempChatId = activeChatId || `temp-${Date.now()}`;
    const isNewChat = !activeChatId;
    const data = {
      file: selectedFile,
      message: value,
      chatid: activeChatId || null,
      userid: userid.id
    };

    if (isNewChat) {
      navigate(`/chat/${tempChatId}`);
      dispatch(addNewChat({
        _id: tempChatId,
        title: value,
        isPublic: false
      }));

    }

    dispatch(addMessage({
      chatId: tempChatId,
      message: {
        file: selectedFile,
        _id: Date.now(),
        role: "user",
        content: value
      },
    }));

    dispatch(setActiveChat(tempChatId));
    dispatch(setTyping({ chatId: tempChatId, typing: true }));

    socket.emit("send_message", data, (response) => {
      const { chatId, chat } = response;
      let finalChatId = tempChatId;

      if (isNewChat && chatId) {
        dispatch(addNewChat(chat));
        dispatch(setTyping({ chatId: chatId, typing: true }));
        dispatch(setActiveChat(chatId));
        navigate(`/chat/${chatId}`);
        if (selectedFile) {
          setSelectedFile(null)
        }
        finalChatId = chatId;
      }

      if (finalChatId !== activeChatId && !finalChatId.startsWith("temp")) {
        return;
      }
    });

    inputRef.current.value = "";
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const startNewChat = () => {
    dispatch(setActiveChat(null));
    navigate('/');
  };

  const selectChat = (chatId) => {
    dispatch(setActiveChat(chatId));
    handleGetChatbyId(chatId);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    if (deleteid.startsWith('temp')) return

    if (activeChatId === chatId) {
      dispatch(setActiveChat(null));
      navigate('/');
    }
    handleDeleteChat(chatId);
  };

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <Sidebar toggleSidebar={toggleSidebar} setPage={setPage} page={page} hasMore={hasMore} loadingMore={loadingMore} sidebarOpen={sidebarOpen} handleGetAllChat={handleGetAllChat} darkMode={darkMode} startNewChat={startNewChat} selectChat={selectChat} deleteChat={deleteChat} toggleDarkMode={toggleDarkMode} />
      {searching && <ChatSearchLanding />}
      {sharing && <ShareChat />}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 h-full overflow-hidden">
        <header className="border-b border-neutral-200/50 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 mr-4 text-neutral-600 dark:text-neutral-300"
            >
              <Menu size={20} />
            </button>
            <p id='Fontlogo' className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-orange-600 capitalize to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              <span className='chatlogo'>chat</span><span className='verse'>verse</span>
            </p>
          </div>
          {activeChatId && pathid == 'chat' &&
            <div>
              <Button onClick={() => dispatch(setSharing(true))} size="sm" className='text-white flex gap-3 justify-center items-center'>
                <Share /> Share
              </Button>
            </div>
          }
        </header>

        <Outlet />

        <div className="my-auto  rounded-lg dark:border-neutral-700/50  backdrop-blur-sm p-4">
          {/* Heading */}
          {pathname == '/' &&
            <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-white">
              What do you want to know?
            </h1>
          }
          {pathid != "share" &&
            <form onSubmit={handleSendMessage} className="flex items-center px-5 py-3 gap-3 max-w-4xl border mx-auto border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-[15px] transition-all duration-200">
              <label htmlFor="file-input" className="cursor-pointer">
                <FilePlusCorner size={18} />
              </label>
              <input type="file" id="file-input" accept="application/pdf" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <input
                type="text"
                ref={inputRef}
                placeholder="Message AI Assistant..."
                className="flex-1 outline-none"
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
          }

          {selectedFile && (
            <div className="mt-4 max-w-xl relative mx-auto bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div onClick={() => setSelectedFile(null)} className='w-8 h-8 bg-neutral-600 text-white absolute top-3 right-3 flex justify-center items-center rounded-full '>
                <X />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Selected file: {selectedFile.name}</p>
              <embed src={URL.createObjectURL(selectedFile)} width="100%" height="100" type="application/pdf" />
            </div>
          )}
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
                  onClick={(e) => handleSendMessage(e, item)}
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