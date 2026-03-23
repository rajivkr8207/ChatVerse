import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Setchatid, SetSearching } from "../chat.slice";
import Button from "../../../components/common/Button";
import useChat from "../hook/useChat";

export default function ChatSearchLanding() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [results, setResults] = useState([]);
    const chats = useSelector((state) => state.chat.chats);
    const { handleSearchChat } = useChat()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery.trim()) return 
        const handleSearch = async () => {
            const res = await handleSearchChat(debouncedQuery)
            setResults(res.data)
        }
        handleSearch()

    }, [debouncedQuery, chats]);

    const openChat = (chatId) => {
        dispatch(Setchatid(chatId));
        dispatch(SetSearching(false))
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="absolute z-20 w-full h-screen bg-neutral-800/30 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 lg:w-3/6 w-full h-8/12 rounded-2xl transform -translate-x-1/2 -translate-y-1/2  z-20  flex items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white">

                <Button className="absolute top-5 right-3 z-30"
                    onClick={() => {
                        dispatch(SetSearching(false));
                    }}
                >X</Button>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,115,0,0.15),transparent_60%)]" />

                <div className="relative w-full max-w-2xl px-6">
                    {/* Heading */}
                    <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
                        Search your chats
                    </h1>

                    {/* Search Box */}
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-lg hover:border-orange-500/40 transition-all">
                        <Search className="text-neutral-400" size={20} />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            type="text"
                            placeholder="Search chats..."
                            className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder-neutral-500"
                        />
                    </div>

                    {/* Results */}
                    {results.length > 0 && (
                        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl">
                            {results.map((chat) => (
                                <div
                                    key={chat._id}
                                    onClick={() => openChat(chat._id)}
                                    className="px-4 py-3 cursor-pointer hover:bg-white/10 transition border-b border-white/5 last:border-none"
                                >
                                    <p className="text-sm font-medium text-white">
                                        {chat.title || "Untitled Chat"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
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
