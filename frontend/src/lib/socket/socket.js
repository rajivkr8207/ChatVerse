import { io } from "socket.io-client";
import ENV from "../../config/env";

const origin = ENV.API_BACKEND_URL
const socket = io(`${origin}`, {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;