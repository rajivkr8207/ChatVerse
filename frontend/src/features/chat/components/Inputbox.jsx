import React from "react";

export const InputBox = React.memo(({ message, setMessage, handleSendMessage }) => {
    return (
        <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message AI Assistant..."
                className="flex-1 px-5 py-3 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-[15px] transition-all duration-200"
            />
        </form>
    );
});