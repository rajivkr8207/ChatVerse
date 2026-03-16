import React from "react";
import {  Plus, 
  Settings, 
  LogOut,
  User,
  MessageCircle, 
  Moon,
  Sun,
  Trash2,
  Edit3} from "lucide-react";

export default function Sidebar({sidebarOpen,darkMode, startNewChat, chatHistory, selectChat, deleteChat, toggleDarkMode}) {
  return (
    <div 
           className={`${
             sidebarOpen ? 'w-64' : 'w-0'
           } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
         >
           <div className="p-4">
             <button
               onClick={startNewChat}
               className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
             >
               <Plus size={18} />
               <span>New Chat</span>
             </button>
           </div>
   
           {/* Chat History */}
           <div className="flex-1 overflow-y-auto px-2">
             {chatHistory.map((chat) => (
               <div
                 key={chat.id}
                 onClick={() => selectChat(chat.id)}
                 className={`group flex items-center justify-between px-3 py-3 my-1 rounded-lg cursor-pointer transition-colors ${
                   chat.active 
                     ? 'bg-gray-800' 
                     : 'hover:bg-gray-800/50'
                 }`}
               >
                 <div className="flex items-center gap-3 truncate">
                   <MessageCircle size={16} className="text-gray-400" />
                   <span className="text-sm truncate">{chat.title}</span>
                 </div>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-1 hover:bg-gray-700 rounded">
                     <Edit3 size={14} />
                   </button>
                   <button 
                     onClick={(e) => deleteChat(chat.id, e)}
                     className="p-1 hover:bg-gray-700 rounded text-red-400"
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
               </div>
             ))}
           </div>
   
           {/* Sidebar Footer */}
           <div className="p-4 border-t border-gray-800">
             <div className="flex items-center gap-3 mb-3 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer">
               <User size={18} />
               <span className="text-sm">My Profile</span>
             </div>
             <div className="flex items-center gap-3 mb-3 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer">
               <Settings size={18} />
               <span className="text-sm">Settings</span>
             </div>
             <div className="flex items-center justify-between px-3 py-2">
               <div className="flex items-center gap-3">
                 <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-800 rounded-lg">
                   {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
                 <span className="text-sm">Theme</span>
               </div>
             </div>
             <div className="flex items-center gap-3 px-3 py-2 mt-2 hover:bg-gray-800 rounded-lg cursor-pointer text-red-400">
               <LogOut size={18} />
               <span className="text-sm">Logout</span>
             </div>
           </div>
         </div>
  );
}