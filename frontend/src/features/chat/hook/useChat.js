import { addnewChat, addnewMessage, Setchatid, Setchatmessage, Setchats, setLoading } from "../chat.slice";
import { CreateChat, DeleteChat, GetAllChat, GetChatById, Sendmessage } from "../services/chat.service"
import { initializeSocketconnection } from "../services/chat.socket"
import { useDispatch, useSelector } from 'react-redux';

const useChat = () => {
    const dispatch = useDispatch()

    const allchats = useSelector(state=>state.chat.chats)

    const handleCreatechat = async () => {
        dispatch(setLoading(true))
        try {
            const res = await CreateChat()
            dispatch(addnewChat(res.data.chat))
            dispatch(Setchatid(res.data.chat._id))
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleSendMessageApi = async (data) => {
        dispatch(setLoading(true))
        try {
            const res = await Sendmessage(data)
            dispatch(addnewMessage(res.data.usermsg))
            dispatch(addnewMessage(res.data.aimesg))
            if(res.data.title){
                handleChangeChatTitle(res.data.title, res.data.usermsg.chat)
            }
            console.log(res.data);
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
            const fileter = allchats.filter(item=>{
                return item._id != chatid
            })
            await DeleteChat(chatid)
            dispatch(Setchats(fileter))
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangeChatTitle = (newtitle, chatid) => {
        const updatedChats = allchats.map((item) => {
            if (item._id === chatid) {
                return { ...item, title: newtitle }
            }
            return item
        })

        dispatch(Setchats(updatedChats))
        return updatedChats
    }

    return {
        initializeSocketconnection,handleCreatechat, handleSendMessageApi, handleGetAllChat, handleDeleteChat, handleGetChatbyId
    }
}

export default useChat