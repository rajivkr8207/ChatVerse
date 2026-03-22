import { MessageCircle } from 'lucide-react'

const TypingIndicator = () => {
    return (
        <div className="flex justify-start animate-fadeIn">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-bl-none p-4 border border-neutral-200/50 dark:border-neutral-700/50 max-w-[80%]">
                <div className="flex items-center gap-2">
                    <div className="relative p-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <div className="absolute inset-0 rounded-lg bg-orange-500 animate-ping opacity-20"></div>
                        <MessageCircle size={14} className="text-orange-600 dark:text-orange-400 relative z-10" />
                    </div>
                    <span className="text-xs font-medium text-orange-600 dark:text-orange-400">AI Assistant</span>
                    <div className="flex items-center gap-0.5 ml-1">
                        <div className="w-1 h-3 bg-orange-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                        <div className="w-1 h-5 bg-orange-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s]"></div>
                        <div className="w-1 h-2 bg-orange-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]"></div>
                    </div>
                </div>
                <span className="text-xs text-orange-500 font-mono tracking-wider animate-pulse block mt-1">
                    PROCESSING
                </span>
            </div>
        </div>
    )
}

export default TypingIndicator