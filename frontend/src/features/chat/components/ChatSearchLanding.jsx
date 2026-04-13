import React, { useEffect, useState } from "react";
import { Search, X, MessageSquare, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveChat, setSearching } from "../chat.slice";
import Button from "../../../components/common/Button";
import useChat from "../hook/useChat";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatSearchLanding() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSearchChat } = useChat();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(state => state.chat.theme);

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
      setIsLoading(true);
      try {
        const res = await handleSearchChat(debouncedQuery);
        setResults(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md ${theme === 'dark' ? 'dark' : ''}`}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight text-foreground">Find <span className="text-primary italic">Conversations</span></h2>
            <button
              onClick={() => dispatch(setSearching(false))}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-neutral-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative group">
            <div className={`absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500`} />
            <div className="relative flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-primary/40 transition-all shadow-lg">
              <Search className={`${isLoading ? 'animate-pulse' : ''} text-primary`} size={22} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search messages, keywords, or topics..."
                className="flex-1 bg-transparent outline-none text-base font-medium placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>
          </div>

          <div className="min-h-[300px] max-h-[400px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
            <AnimatePresence mode="popLayout">
              {results.length > 0 ? (
                results.map((chat, i) => (
                  <motion.div
                    key={chat._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => openChat(chat._id)}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <MessageSquare size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-foreground group-hover:text-primary">
                          {chat.title || "Untitled Chat"}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          Last updated {new Date(chat.updatedAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-neutral-300 group-hover:text-primary transition-colors translate-x-1 group-hover:translate-x-0" />
                  </motion.div>
                ))
              ) : debouncedQuery ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-neutral-500 gap-4">
                  <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                     <Search size={32} />
                  </div>
                  <p className="font-medium">No conversations found for "{debouncedQuery}"</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-neutral-400 gap-2 opacity-60 italic">
                  <p className="text-sm text-center">Type something above to search through your<br />entire chat history.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}