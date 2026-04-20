import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  Send,
  Share,
  X,
  FilePlus,
  ArrowUp,
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
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const theme = useSelector(state => state.chat.theme);
  const pathname = location.pathname;
  const pathid = `${window.location.pathname.split('/')[1]}`
  const deleteid = `${window.location.pathname.split('/')[2]}`

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const landingRef = useRef(null);
  const fileInputRef = useRef(null);
  const userid = useSelector(state => state.auth.user)
  const sharing = useSelector(state => state.chat.sharing)
  const activeChatId = useSelector(state => state.chat.activeChatId)
  const chats = useSelector(state => state.chat.chats)
  const searching = useSelector(state => state.chat.searching)
  const [inputValue, setInputValue] = useState('')
  const messages = chats[activeChatId]?.messages || []
  const typing = chats[activeChatId]?.typing || false
  const { handleGetAllChat, setPage, handleDeleteChat, handleGetChatbyId, page, hasMore, loadingMore, } = useChat()
  const messagesEndRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useGSAP(() => {
    if (pathname === '/') {
      gsap.fromTo(".landing-content > *",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    }
  }, { dependencies: [pathname], scope: landingRef });

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
      if (isNewChat && chatId) {
        dispatch(addNewChat(chat));
        dispatch(setTyping({ chatId: chatId, typing: true }));
        dispatch(setActiveChat(chatId));
        navigate(`/chat/${chatId}`);
        if (selectedFile) setSelectedFile(null);
      }
    });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setInputValue("");
    inputRef.current?.focus();
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
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        toggleSidebar={toggleSidebar}
        setPage={setPage}
        page={page}
        hasMore={hasMore}
        loadingMore={loadingMore}
        sidebarOpen={sidebarOpen}
        handleGetAllChat={handleGetAllChat}
        startNewChat={startNewChat}
        selectChat={selectChat}
        deleteChat={deleteChat}
      />

      {searching && <ChatSearchLanding />}
      {sharing && <ShareChat />}

      <main className="flex-1 relative flex flex-col bg-background text-foreground transition-colors duration-300 h-full overflow-hidden">
        {/* Floating Glass Header */}
        <header className="absolute top-0 left-0 right-0 z-40 p-3 md:p-4 pointer-events-none">
          <div className="max-w-6xl mx-auto flex justify-between items-center glass rounded-2xl px-4 py-3 pointer-events-auto border border-border shadow-2xl shadow-black/5">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-muted rounded-xl transition-all duration-200 text-muted-foreground"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-1">
                <span className="chatlogo text-xl md:text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">chat</span>
                <span className="verse text-xl md:text-2xl font-bold">Verse</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeChatId && pathid === 'chat' && (
                <Button
                  onClick={() => dispatch(setSharing(true))}
                  size="sm"
                  className="rounded-xl flex gap-2 items-center px-4"
                >
                  <Share size={16} />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col pt-20 md:pt-24">
          <Outlet />

          {pathname === '/' && (
            <div ref={landingRef} className="flex-1 flex flex-col items-center justify-center p-6 landing-content">
              <div className="mb-6 md:mb-8 p-4 bg-primary/10 rounded-full float-animation text-primary">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <ArrowUp size={32} />
                </div>
              </div>
              <h1 className="text-3xl md:text-6xl font-black text-center mb-4 tracking-tight leading-tight">
                What can I <span className="text-primary italic">help</span><br className="hidden md:block" />you with today?
              </h1>
              <p className="text-muted-foreground text-center max-w-lg mb-8 md:mb-12 text-base md:text-lg">
                Ask anything. I'm here to help you brainstorm, research, or just chat.
              </p>
            </div>
          )}

          {/* Floating Input Area */}
          <div className="max-w-4xl w-full mx-auto p-4 md:p-8 space-y-4">
            {pathid !== "share" && (
              <div className="relative group">
                {/* File Preview */}
                {selectedFile && (
                  <div className="absolute bottom-full left-0 right-0 mb-4 animate-slide-up">
                    <div className="glass rounded-2xl p-3 flex items-center gap-3 border border-primary/20 shadow-2xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <FilePlus size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{selectedFile.name}</p>
                        <p className="text-[10px] opacity-60 uppercase">PDF Document</p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="glass p-1.5 md:p-2 pl-3 md:pl-4 rounded-[2rem] flex items-center gap-1.5 md:gap-2 border border-border focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all duration-300 shadow-2xl shadow-black/5"
                >
                  <label htmlFor="file-input" className="p-2 hover:bg-muted rounded-full cursor-pointer transition-colors text-muted-foreground">
                    <FilePlus size={20} />
                  </label>
                  <input
                    type="file"
                    id="file-input"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <input
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask ChatVerse anything..."
                    className="flex-1 bg-transparent py-2 md:py-3 outline-none text-sm md:text-base font-medium placeholder:text-muted-foreground/60"
                  />
                  <button
                    type="submit"
                    disabled={typing || (!inputValue.trim() && !selectedFile)}
                    className="w-10 h-10 md:w-12 md:h-12 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:grayscale shadow-lg shadow-primary/20 active:scale-95"
                  >
                    <ArrowUp size={24} />
                  </button>
                </form>
              </div>
            )}

            {/* Suggestions */}
            {pathname === '/' && (
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 landing-content">
                {[
                  "Tokyo trip plan",
                  "Scraping script",
                  "Decision models",
                  "Healthy breakfast",
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleSendMessage(e, item)}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl glass border border-border text-xs md:text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;