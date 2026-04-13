import {
  Plus,
  Settings,
  LogOut,
  User,
  MessageCircle,
  Moon,
  Sun,
  Trash2,
  X,
  Menu,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hook/useAuth";
import cvlogo from '../../../../public/cvlogo.png'
import { setActiveChat, setSearching, toggleTheme } from "../chat.slice";
import Button from "../../../components/common/Button";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ toggleSidebar, page, setPage, hasMore, sidebarOpen, startNewChat, deleteChat }) {
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const chats = useSelector(state => state.chat.chats);
  const chatOrder = useSelector(state => state.chat.chatOrder);
  const theme = useSelector(state => state.chat.theme);
  const user = useSelector(state => state.auth.user); // Correctly select user

  const { handlelogout } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const listRef = useRef(null);

  const navigatepage = (nav) => {
    navigate(nav);
    dispatch(setActiveChat(null));
    if (window.innerWidth < 1024) toggleSidebar(); // Close on mobile
  };

  const handleNewChat = () => {
    startNewChat();
    if (window.innerWidth < 1024) toggleSidebar();
  };

  // Framer Motion Variants for Staggered list
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <div
        className={`${sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0'
          } fixed lg:relative z-50 bg-card text-card-foreground transition-all duration-300 ease-in-out overflow-hidden flex flex-col border-r border-border h-full shadow-2xl lg:shadow-none`}
      >
        {/* Header */}
        <div className="flex p-5 justify-between items-center border-b border-border">
          <div
            onClick={() => navigatepage('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-primary/20">
              <img src={cvlogo} className={`w-5 h-5 brightness-0 invert`} alt="Logo" />
            </div>
            <div className="flex flex-col">
              <span className="chatlogo text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic leading-none">chat</span>
              <span className="verse text-xs font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mt-1">Verse AI</span>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-muted rounded-xl transition-all duration-200 lg:hidden text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-4 flex flex-col gap-3">
          <Button
            onClick={handleNewChat}
            className="w-full flex justify-center items-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-bold text-sm tracking-tight">New Conversation</span>
          </Button>

          <button
            onClick={() => {
              dispatch(setSearching(true));
              if (window.innerWidth < 1024) toggleSidebar();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-secondary-theme text-secondary-theme-foreground hover:bg-muted transition-all duration-200 text-sm font-bold border border-border/50"
          >
            <Search size={18} className="text-primary" />
            <span>Search Memory</span>
          </button>
        </div>

        {/* Chat History */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar"
        >
          <div className="px-3 mb-3 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Recent Threads</h3>
            {chatOrder.length > 0 && <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-md font-bold text-muted-foreground">{chatOrder.length}</span>}
          </div>

          <motion.div
            className="space-y-1"
            variants={containerVariants}
            initial="hidden"
            animate={sidebarOpen ? "show" : "hidden"}
          >
            <AnimatePresence mode="popLayout">
              {chatOrder
                .filter(chatId => !chatId.startsWith("temp"))
                .map((chatId) => {
                  const chat = chats[chatId];
                  if (!chat) return null;
                  const isActive = chatId === activeChatId;

                  return (
                    <motion.div
                      key={chat._id || chatId}
                      variants={itemVariants}
                      exit={{ opacity: 0, x: -10 }}
                      onClick={() => {
                        dispatch(setActiveChat(chatId));
                        navigate(`/chat/${chatId}`);
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className={`chat-item group relative flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-card-foreground'
                        }`}
                    >
                      <div className="flex items-center gap-3 truncate flex-1">
                        <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-primary/20' : 'bg-muted/50 group-hover:bg-muted'}`}>
                          <MessageCircle size={14} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'} />
                        </div>
                        <span className={`text-sm font-bold truncate ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                          {chat.title}
                        </span>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chatId, e)
                          }}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors duration-200 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
            </AnimatePresence>
          </motion.div>

          {hasMore && (
            <button
              onClick={() => setPage(page + 1)}
              className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all duration-200"
            >
              • Load archive •
            </button>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border mt-auto bg-muted/30">
          <div className="grid grid-cols-1 mb-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="group flex items-center justify-center gap-3 
               px-5 py-3 rounded-2xl 
               bg-card border border-border 
               text-card-foreground 
               hover:bg-muted 
               transition-all duration-300 
               shadow-sm hover:shadow-md"
            >
              {theme === 'dark' ? (
                <Sun
                  size={20}
                  className="text-orange-400 transition-transform duration-300 group-hover:rotate-12"
                />
              ) : (
                <Moon
                  size={20}
                  className="text-indigo-400 transition-transform duration-300 group-hover:-rotate-12"
                />
              )}

              <span className="text-sm font-semibold tracking-wide">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
          <div
            onClick={() => navigatepage('/profile')}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group shadow-sm"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-lg overflow-hidden font-black uppercase">
                {user?.fullName?.[0] || user?.username?.[0] || <User size={18} />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-card-foreground truncate leading-tight">
                {user?.fullName || user?.username || "Guest User"}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-tighter">
                {user?.role === 'admin' ? 'Administrator' : 'Premium Account'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlelogout();
              }}
              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all duration-200"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}