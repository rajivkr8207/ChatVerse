import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        chatId: null,
        chatmessages: [],
        isloading: false,
        error: null,
        typing: false,
        searching: false,
        sharing: false,
    },
    reducers: {
        addnewMessage: (state, action) => {
            state.chatmessages.push(action.payload)
        },
        addnewChat: (state, action) => {
            state.chats.unshift(action.payload)
        },
        addChatToend: (state, action) => {
            const newChats = action.payload;
            const unique = newChats.filter(
                (newMsg) => !state.chats.some(c => c._id === newMsg._id)
            );
            state.chats.push(...unique);
        },
        Setchats: (state, action) => {
            state.chats = action.payload
        },
        Setchatmessage: (state, action) => {
            state.chatmessages = action.payload
        },
        Setchatid: (state, action) => {
            state.chatId = action.payload
        },
        SetTyping: (state, action) => {
            state.typing = action.payload
        },
        SetSearching: (state, action) => {
            state.searching = action.payload
        },
        SetSharing: (state, action) => {
            state.sharing = action.payload
        },
        setLoading: (state, action) => {
            state.isloading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setError, SetTyping,SetSharing, SetSearching, addnewChat, addChatToend, setLoading, Setchatmessage, addnewMessage, Setchats, Setchatid } = chatSlice.actions
export default chatSlice.reducer