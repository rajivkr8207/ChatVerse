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
import { setActiveChat, setSearching } from "../chat.slice";
import Button from "../../../components/common/Button";
export default function Sidebar({ toggleSidebar, page, setPage, hasMore, sidebarOpen, darkMode, startNewChat, deleteChat, toggleDarkMode }) {
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const chats = useSelector(state => state.chat.chats);
  const chatOrder = useSelector(state => state.chat.chatOrder);
  const { handlelogout } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const navigatepage = (nav) => {
    navigate(nav);
    dispatch(setActiveChat(null));
  };
  return (
    <div
      className={`${sidebarOpen ? 'w-72' : 'w-0'
        } bg-gradient-to-b from-neutral-900 to-neutral-950 text-white transition-all duration-300 ease-in-out overflow-hidden flex flex-col border-r border-neutral-800/50`}
    >
      <div className="flex p-3  justify-between items-center ">
        <div onClick={() => navigatepage('/')} className="p-1 bg-black rounded-full">
          <img src={cvlogo} className="w-8 h-8" alt="" srcset="" />
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 mr-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className="p-5 border-b border-neutral-800/50 flex flex-col gap-5">
        <Button
          onClick={startNewChat}
          className="w-full flex justify-center items-center gap-3 py-3"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          <span className="font-medium">New Chat</span>
        </Button>
        <Button
          onClick={() => dispatch(setSearching(true))}
          className="flex justify-center items-center gap-3 py-3"
          size="sm"
        >
          <Search /> Search Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {chatOrder
          .filter(chatId => !chatId.startsWith("temp"))
          .map((chatId) => {

            const chat = chats[chatId];
            return (
              <div
                key={chat.id}
                onClick={() => {
                  dispatch(setActiveChat(chatId));
                  navigate(`/chat/${chatId}`);
                }}
                className={`group relative flex items-center justify-between px-4 py-3.5 my-1 rounded-xl cursor-pointer transition-all duration-200 ${chatId === activeChatId
                  ? 'bg-gradient-to-r from-orange-600/20 to-orange-600/5 border-l-4 border-l-orange-500'
                  : 'hover:bg-neutral-800/50 border-l-4 border-l-transparent hover:border-l-neutral-600'
                  }`}
              >
                <div className="flex items-center gap-3 truncate flex-1">
                  <div className={`p-1.5 rounded-lg ${chatId === activeChatId ? 'bg-orange-500/20' : 'bg-neutral-800/50 group-hover:bg-neutral-700/50'
                    } transition-colors duration-200`}>
                    <MessageCircle size={16} className={chatId === activeChatId ? 'text-orange-400' : 'text-neutral-400'} />
                  </div>
                  <span className={`text-sm font-medium truncate ${chatId === activeChatId ? 'text-white' : 'text-neutral-300'
                    }`}>
                    {chat.title}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2">
                  <button
                    onClick={(e) => deleteChat(chatId, e)}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors duration-200 text-neutral-400 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}

        {hasMore && <>
          <button onClick={() => setPage(page + 1)}
            className="mx-auto flex items-center justify-center gap-3 px-4 py-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-xl transition-all duration-200 border border-orange-500/20 shadow-lg shadow-orange-600/20 group"
          >loadmore</button>
        </>}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-neutral-800/50 bg-gradient-to-t from-neutral-900 to-transparent">
        {/* Profile Section */}
        <div onClick={() => navigatepage('/profile')} className="mb-2 px-3 py-2.5 hover:bg-neutral-800/70 rounded-xl transition-all duration-200 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <User size={18} className="text-orange-400 group-hover:text-orange-300" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium block text-neutral-200">My Profile</span>
              <span className="text-xs text-neutral-500">View account</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-2 px-3 py-2.5 hover:bg-neutral-800/70 rounded-xl transition-all duration-200 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-xl group-hover:rotate-90 transition-transform duration-200">
              <Settings size={18} className="text-neutral-300" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium block text-neutral-200">Settings</span>
              <span className="text-xs text-neutral-500">Preferences</span>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="mb-2 px-3 py-2.5 hover:bg-neutral-800/70 rounded-xl transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-neutral-800/70 hover:bg-neutral-700 rounded-xl transition-all duration-200 group-hover:scale-110"
              >
                {darkMode ?
                  <Sun size={18} className="text-yellow-400" /> :
                  <Moon size={18} className="text-neutral-300" />
                }
              </button>
              <span className="text-sm font-medium text-neutral-200">Theme</span>
            </div>
            <div className="text-xs px-2 py-1 bg-neutral-800 rounded-lg text-neutral-400">
              {darkMode ? 'Dark' : 'Light'}
            </div>
          </div>
        </div>

        {/* Logout */}
        <div onClick={() => { handlelogout() }} className="mt-4 px-3 py-2.5  hover:bg-red-500/10 rounded-xl transition-all duration-200 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors duration-200">
              <LogOut size={18} className="text-red-400 group-hover:text-red-300" />
            </div>
            <span className="text-sm font-medium text-red-400 group-hover:text-red-300">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}