import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        chatId: null,
        chatmessages: [],
        isloading: false,
        error: null,
    },
    reducers: {
        addnewMessage: (state,action)=>{
            state.chatmessages.push(action.payload)
        },
        addnewChat: (state,action)=>{
            state.chats.unshift(action.payload)
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
        setLoading: (state, action) => {
            state.isloading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setError,addnewChat, setLoading,Setchatmessage,addnewMessage, Setchats, Setchatid } = chatSlice.actions
export default chatSlice.reducer