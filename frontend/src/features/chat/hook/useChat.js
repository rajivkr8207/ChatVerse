import { useEffect, useState } from "react";
import {
    addChatsToEnd,
    addNewChat,
    addMessage,
    setActiveChat,
    setMessages,
    setChatLoading,
    setChatError,
    removeChat
} from "../chat.slice";

import {
    DeleteChat,
    GetAllChat,
    GetChatById,
    GetShareChatApi,
    SearchChat,
    Sendmessage,
    ShareChatApi
} from "../services/chat.service";

import { initializeSocketconnection } from "../services/chat.socket";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const useChat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const activeChatId = useSelector(state => state.chat.activeChatId);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (!hasMore) return;
        handleGetAllChat();
    }, [page]);

    const handleSendMessageApi = async (data) => {
        const chatId = activeChatId;

        dispatch(setChatLoading({ chatId, loading: true }));

        try {
            const res = await Sendmessage(data);

            const { usermsg, aimesg, chat } = res.data;
            dispatch(addMessage({
                chatId: usermsg.chat,
                message: usermsg,
                role: 'user'
            }));

            dispatch(addMessage({
                chatId: aimesg.chat,
                message: aimesg,
                role: "ai"
            }));

            if (!chatId && chat) {
                dispatch(addNewChat(chat));
                dispatch(setActiveChat(chat._id));
            }

        } catch (error) {
            console.error(error);
            dispatch(setChatError({
                chatId,
                error: error.message
            }));
        } finally {
            dispatch(setChatLoading({ chatId, loading: false }));
        }
    };

    const handleGetAllChat = async () => {
        if (!hasMore || loadingMore) return;

        setLoadingMore(true);

        try {
            const res = await GetAllChat({ page });

            dispatch(addChatsToEnd(res.data.chats));

            const { page: current, totalPages } = res.data.pagination;

            if (current >= totalPages) {
                setHasMore(false);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleGetChatbyId = async (chatId) => {
        try {
            const res = await GetChatById(chatId);

            dispatch(setMessages({
                chatId,
                messages: res.data.messages
            }));

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);

            dispatch(setChatError({
                chatId,
                error: message
            }));

            navigate('/');
        }
    };

    const handleDeleteChat = async (chatId) => {
        try {
            await DeleteChat(chatId);
            dispatch(removeChat(chatId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleShareChat = async (chatId) => {
        try {
            return await ShareChatApi(chatId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchChat = async (query) => {
        try {
            return await SearchChat(query);
        } catch (error) {
            console.error(error);
        }
    };


    const handleGetShareChat = async (shareid) => {
        try {
            const res = await GetShareChatApi(shareid);

            const tempChatId = `share-${Date.now()}`;

            dispatch(addNewChat({
                _id: tempChatId,
                title: "Shared Chat"
            }));

            dispatch(setMessages({
                chatId: tempChatId,
                messages: res.data
            }));

            dispatch(setActiveChat(tempChatId));

            return res;

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);

            dispatch(setChatError({
                chatId: activeChatId,
                error: message
            }));

            navigate('/');
        }
    };

    return {
        initializeSocketconnection,
        handleSearchChat,
        handleGetShareChat,
        handleShareChat,
        page,
        setPage,
        hasMore,
        loadingMore,
        handleSendMessageApi,
        handleGetAllChat,
        handleDeleteChat,
        handleGetChatbyId
    };
};

export default useChat;