import { useEffect, useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { SetSharing } from "../chat.slice";
import useChat from "../hook/useChat";
import { GetChatById } from "../services/chat.service";

export default function ShareChat({ title = "Share this" }) {
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('')
    const Url = `${window.origin}`;
    const pathid = `${window.location.pathname.split('/')[2]}`
    const dispatch = useDispatch()
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };
    const { handleShareChat } = useChat()

    async function FetchChat() {
        const res = await GetChatById(pathid)
        if (res.success) {
            setShareUrl(`${Url}/share/${res?.data?.chat?.shareId}`)
        }
    }

    async function GetShareChat() {
        try {
            await handleShareChat(pathid)
        } catch (error) {
            console.error(error);
        } finally {
            FetchChat()
        }
    }
    useEffect(() => {
        GetShareChat()
    }, [])


    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-neutral-800 w-[90%] max-w-md rounded-2xl p-5 shadow-lg relative text-white">

                    {/* Close */}
                    <button
                        onClick={() => dispatch(SetSharing(false))}
                        className="absolute right-3 top-3 text-gray-500 hover:text-black"
                    >
                        <X />
                    </button>

                    <h2 className="text-lg font-semibold mb-4 ">{title}</h2>
                    <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                            type="text"
                            value={shareUrl || "genrating....."}
                            readOnly
                            className="flex-1 px-3 py-2 outline-none"
                        />
                        <button
                            onClick={handleCopy}
                            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-950"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>

                    {/* Actions */}
                    {/* <div className="mt-4 flex gap-2">
                        <button
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                            Share via Apps
                        </button>
                    </div> */}
                </div>
            </div>
        </>
    );
}