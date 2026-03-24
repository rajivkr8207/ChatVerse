import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveChat, setSearching } from "../chat.slice";
import Button from "../../../components/common/Button";
import useChat from "../hook/useChat";

export default function ChatSearchLanding() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);

  const { handleSearchChat } = useChat();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const handleSearch = async () => {
      try {
        const res = await handleSearchChat(debouncedQuery);
        setResults(res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  const openChat = (chatId) => {
    dispatch(setActiveChat(chatId));
    dispatch(setSearching(false));
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="absolute z-20 w-full h-screen bg-neutral-800/30 backdrop-blur-sm">
      <div className="fixed top-1/2 left-1/2 lg:w-3/6 w-full h-8/12 rounded-2xl transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white">

        <Button
          className="absolute top-5 right-3 z-30"
          onClick={() => dispatch(setSearching(false))}
        >
          <X />
        </Button>

        <div className="relative w-full max-w-2xl px-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
            Search your chats
          </h1>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
            <Search className="text-neutral-400" size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search chats..."
              className="flex-1 bg-transparent outline-none text-sm md:text-base"
            />
          </div>

          {results.length > 0 && (
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {results.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => openChat(chat._id)}
                  className="px-4 py-3 cursor-pointer hover:bg-white/10 border-b border-white/5 last:border-none"
                >
                  <p className="text-sm font-medium">
                    {chat.title || "Untitled Chat"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {debouncedQuery && results.length === 0 && (
            <p className="text-center text-neutral-400 mt-4 text-sm">
              No chats found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}