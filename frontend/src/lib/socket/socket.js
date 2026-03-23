import { io } from "socket.io-client";

const origin = import.meta.env.VITE_BACK_URL
const socket = io(`${origin}`, {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;