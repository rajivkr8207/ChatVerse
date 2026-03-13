import { Bookmark, Share2 } from "lucide-react"

const Header = ({activeChat, chats}) => {
  return (
    <>
     {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {activeChat ? chats.find(c => c.id === activeChat)?.title : 'Welcome to Nova AI'}
            </h2>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </header>
    </>
  )
}

export default Header