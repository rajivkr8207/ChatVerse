import { useEffect, useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSharing } from "../chat.slice";
import useChat from "../hook/useChat";
import { GetChatById } from "../services/chat.service";

export default function ShareChat({ title = "Share this" }) {
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const Url = `${window.origin}`;
    const dispatch = useDispatch();
    const { handleShareChat } = useChat();

    const activeChatId = useSelector(state => state.chat.activeChatId);

    const handleCopy = async () => {
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
        try {
            await handleShareChat(activeChatId)
        } catch (error) {
            console.error(error);
        } finally {
            FetchChat()
        }
    }
    useEffect(() => {
        GetShareChat()
    }, [activeChatId])

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 w-[90%] max-w-md rounded-2xl p-5 shadow-lg relative text-white">

                {/* Close */}
                <button
                    onClick={() => dispatch(setSharing(false))}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                    <X />
                </button>

                <h2 className="text-lg font-semibold mb-4">{title}</h2>

                <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden">
                    <input
                        type="text"
                        value={shareUrl || "Generating link..."}
                        readOnly
                        className="flex-1 px-3 py-2 bg-transparent outline-none text-sm"
                    />

                    <button
                        onClick={handleCopy}
                        disabled={!shareUrl}
                        className="px-3 py-2 bg-neutral-900 hover:bg-neutral-950 disabled:opacity-50"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}