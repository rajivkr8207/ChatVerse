import { api } from "../../../lib/api/axios"




export async function Sendmessage(data) {
    const res = await api.post('/chat/messages', data)
    return res.data
}



export async function GetAllChat({ page }) {
    const res = await api.get(`/chat?page=${page}`)
    return res.data
}

export async function GetChatById(chatid) {
    const res = await api.get(`/chat/${chatid}`)
    return res.data
}

export async function DeleteChat(chatid) {
    const res = await api.delete(`/chat/${chatid}`)
    return res.data
}

export async function SearchChat(search) {
    const res = await api.get(`/chat/search?q=${search}`)
    return res.data
}

export async function ShareChatApi(chatid) {
    const res = await api.post(`/chat/share/${chatid}`)
    return res.data
}

export async function GetShareChatApi(chatid) {
    const res = await api.get(`/chat/share/${chatid}`)
    return res.data
}