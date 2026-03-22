import { addnewChat, addnewMessage, Setchatid, Setchatmessage, Setchats, setLoading } from "../chat.slice";
import { DeleteChat, GetAllChat, GetChatById, Sendmessage } from "../services/chat.service"
import { initializeSocketconnection } from "../services/chat.socket"
import { useDispatch, useSelector } from 'react-redux';

const useChat = () => {
    const dispatch = useDispatch()

    const allchats = useSelector(state => state.chat.chats)
    const chatId = useSelector(state => state.chat.chatId)



    const handleSendMessageApi = async (data) => {
        dispatch(setLoading(true))
        try {
            const res = await Sendmessage(data)
            console.log(res);
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
        try {
            const res = await GetAllChat()
            dispatch(Setchats(res.data.chats))
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetChatbyId = async (chatid) => {
        try {
            const res = await GetChatById(chatid)
            dispatch(Setchatmessage(res.data.chatmsg))
            console.log(res);
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

    return {
        initializeSocketconnection, handleSendMessageApi, handleGetAllChat, handleDeleteChat, handleGetChatbyId
    }
}

export default useChat