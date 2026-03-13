import { Search } from 'lucide-react'
import React from 'react'

const SearchItem = ({handleSearch, searchQuery, setSearchQuery}) => {
  return (
    <>
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 transition">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 py-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="mr-2 px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Ask
              </button>
            </div>
          </form>
        </div>
    </>
  )
}

export default SearchItem