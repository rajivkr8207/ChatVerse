import { Bookmark, Home, Menu, MessageSquare, Moon, Plus, Search, Settings, Sparkles, Sun, User } from 'lucide-react'
import React from 'react'


// Sidebar Item Component
const SidebarItem = ({ icon, label, isOpen, active = false }) => (
    <button className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${active
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}>
        <span className="w-5 h-5">{icon}</span>
        {isOpen && <span>{label}</span>}
    </button>
);


const Sidebar = ({ isSidebarOpen, setSidebarOpen, createNewChat, chats, setActiveChat, toggleTheme, isDarkMode }) => {


    return (
        <>
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>

                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    {isSidebarOpen ? (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Nova AI
                        </h1>
                    ) : (
                        <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={createNewChat}
                    className="mx-3 mt-4 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 transition"
                >
                    <Plus className="w-5 h-5" />
                    {isSidebarOpen && <span>New Chat</span>}
                </button>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="space-y-1 px-3">
                        <SidebarItem icon={<Home />} label="Home" isOpen={isSidebarOpen} active />
                        <SidebarItem icon={<Search />} label="Explore" isOpen={isSidebarOpen} />
                        <SidebarItem icon={<Bookmark />} label="Saved" isOpen={isSidebarOpen} />
                    </div>

                    {isSidebarOpen && (
                        <div className="mt-6">
                            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Recent Chats
                            </h3>
                            <div className="mt-2 space-y-1 px-3">
                                {chats.map(chat => (
                                    <button
                                        key={chat.id}
                                        onClick={() => setActiveChat(chat.id)}
                                        className={`w-full p-2 text-sm rounded-lg flex items-center gap-2 transition ${chat.active
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                        <div className="flex-1 text-left truncate">
                                            <p className="truncate">{chat.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <button className="w-full flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition">
                        <User className="w-5 h-5" />
                        {isSidebarOpen && <span>Profile</span>}
                    </button>
                    <button className="w-full flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition mt-1">
                        <Settings className="w-5 h-5" />
                        {isSidebarOpen && <span>Settings</span>}
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition mt-1"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {isSidebarOpen && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar