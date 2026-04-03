import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: {},
    chatOrder: [],
    activeChatId: null,
    searching: false,
    sharing: false
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addNewChat: (state, action) => {
            const chat = action.payload;
            state.chats[chat._id] = {
                ...chat,
                messages: [],
                loading: false,
                typing: false,
                error: null
            };
            state.chatOrder.unshift(chat._id);
        },
        removeAllTempChats: (state) => {
            const newChats = {};
            const newOrder = [];

            Object.keys(state.chats).forEach(id => {
                if (!id.startsWith("temp")) {
                    newChats[id] = state.chats[id];
                    newOrder.unshift(id);
                }
            });

            state.chats = newChats;
            state.chatOrder = newOrder;

            if (state.activeChatId?.startsWith("temp")) {
                state.activeChatId = null;
            }
        },
        replaceMessage: (state, action) => {
            const { chatId, tempId, newMessage } = action.payload;

            const msgs = state.chats[chatId]?.messages || [];

            const index = msgs.findIndex(m => m._id === tempId);

            if (index !== -1) {
                msgs[index] = newMessage;
            }
        },
        setActiveChat: (state, action) => {
            state.activeChatId = action.payload;
        },

        addMessage: (state, action) => {
            const { chatId, message } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push(message);
            }
        },

        setMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        },

        setChatLoading: (state, action) => {
            const { chatId, loading } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].loading = loading;
            }
        },

        setTyping: (state, action) => {
            const { chatId, typing } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].typing = typing;
            }
        },

        setChatError: (state, action) => {
            const { chatId, error } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].error = error;
            }
        },

        addChatsToEnd: (state, action) => {
            const newChats = action.payload;

            newChats.forEach(chat => {
                if (!state.chats[chat._id]) {
                    state.chats[chat._id] = {
                        ...chat,
                        messages: [],
                        loading: false,
                        typing: false,
                        error: null
                    };
                    state.chatOrder.push(chat._id);
                }
            });
        },

        setSearching: (state, action) => {
            state.searching = action.payload;
        },

        setSharing: (state, action) => {
            state.sharing = action.payload;
        },
        removeChat: (state, action) => {
            const chatId = action.payload;

            delete state.chats[chatId];

            state.chatOrder = state.chatOrder.filter(id => id !== chatId);

            if (state.activeChatId === chatId) {
                state.activeChatId = null;
            }
        },
    }
});

export const {
    addNewChat,
    setActiveChat,
    addMessage,
    setMessages,
    setChatLoading,
    setTyping,
    setChatError,
    addChatsToEnd,
    setSearching,
    replaceMessage,
    removeChat,
    removeAllTempChats,
    setSharing,
} = chatSlice.actions;

export default chatSlice.reducer;