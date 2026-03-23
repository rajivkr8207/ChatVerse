import { useEffect, useState } from "react";
import { addChatToend, addnewChat, addnewMessage, Setchatid, Setchatmessage, Setchats, setLoading } from "../chat.slice";
import { DeleteChat, GetAllChat, GetChatById, SearchChat, Sendmessage, ShareChat } from "../services/chat.service"
import { initializeSocketconnection } from "../services/chat.socket"
import { useDispatch, useSelector } from 'react-redux';

const useChat = () => {
    const dispatch = useDispatch()

    const allchats = useSelector(state => state.chat.chats)
    const chatId = useSelector(state => state.chat.chatId)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);



    useEffect(() => {
        if (!hasMore) return
        handleGetAllChat()
    }, [page]);



    const handleSendMessageApi = async (data) => {
        dispatch(setLoading(true))
        try {
            const res = await Sendmessage(data)
            dispatch(addnewMessage(res.data.usermsg))
            dispatch(addnewMessage(res.data.aimesg))
            if (!chatId) {
                dispatch(Setchatid(res.data.aimesg.chat))
                dispatch(addnewChat(res.data.chat))
            }
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetAllChat = async () => {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
        try {
            const res = await GetAllChat({ page })
            dispatch(addChatToend(res.data.chats))
            if (res.data.pagination.page == res.data.pagination.totalPages || res.data.pagination.page > res.data.pagination.totalPages) {
                setHasMore(false)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    }

    const handleGetChatbyId = async (chatid) => {
        try {
            const res = await GetChatById(chatid)
            dispatch(Setchatmessage(res.data.messages))
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteChat = async (chatid) => {
        try {
            const fileter = allchats.filter(item => {
                return item._id != chatid
            })
            await DeleteChat(chatid)
            dispatch(Setchats(fileter))
        } catch (error) {
            console.error(error);
        }
    }

    const handleShareChat = async (chatid) => {
        try {
            const res = await ShareChat(chatid)
            return res
        } catch (error) {
            console.error(error);
        }
    }

      const handleSearchChat = async (query) => {
        try {
            const res = await SearchChat(query)
            return res
        } catch (error) {
            console.error(error);
        }
    }
    return {
        initializeSocketconnection,handleSearchChat, handleShareChat, page, setPage, hasMore, loadingMore, handleSendMessageApi, handleGetAllChat, handleDeleteChat, handleGetChatbyId
    }
}

export default useChat