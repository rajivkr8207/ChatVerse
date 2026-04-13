import { useEffect, useState } from "react";
import { Copy, Check, X, Share2, Link as LinkIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSharing } from "../chat.slice";
import useChat from "../hook/useChat";
import { GetChatById } from "../services/chat.service";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareChat({ title = "Share Conversation" }) {
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const Url = `${window.origin}`;
    const dispatch = useDispatch();
    const { handleShareChat } = useChat();
    const theme = useSelector(state => state.chat.theme);
    const activeChatId = useSelector(state => state.chat.activeChatId);

    const handleCopy = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    async function FetchChat() {
        const res = await GetChatById(activeChatId)
        if (res.success) {
            setShareUrl(`${Url}/share/${res?.data?.chat?.shareId}`)
        }
    }

    async function GetShareChat() {
        setIsLoading(true);
        try {
            await handleShareChat(activeChatId)
        } catch (error) {
            console.error(error);
        } finally {
            await FetchChat();
            setIsLoading(false);
        }
    }

    useEffect(() => {
        GetShareChat()
    }, [activeChatId])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md ${theme === 'dark' ? 'dark' : ''}`}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="w-full max-w-4xl glass rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                >
                    <div className="p-6 md:p-8 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                    <Share2 size={20} />
                                </div>
                                <h2 className="text-xl font-black tracking-tight text-foreground">{title}</h2>
                            </div>
                            <button
                                onClick={() => dispatch(setSharing(false))}
                                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground opacity-90">Snapshot Link</p>
                            <p className="text-xs text-muted-foreground">
                                Anyone with this link will be able to view a snapshot of this conversation.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-inner transition-all focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50">
                                    <LinkIcon size={18} className="text-primary" />
                                    <input
                                        type="text"
                                        value={isLoading ? "Generating thread link..." : shareUrl}
                                        readOnly
                                        className="flex-1 bg-transparent outline-none text-sm font-bold text-foreground truncate placeholder:text-muted-foreground/50"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        disabled={isLoading || !shareUrl}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${copied
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                : 'bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50'
                                            }`}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'Link Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={() => dispatch(setSharing(false))}
                                className="w-full py-4 rounded-2xl bg-foreground text-background font-black text-sm hover:opacity-90 transition-opacity"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}