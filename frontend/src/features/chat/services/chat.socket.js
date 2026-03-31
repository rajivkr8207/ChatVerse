import { io } from "socket.io-client";
import ENV from "../../../config/env";


export const initializeSocketconnection = ()=>{

    const socket = io(ENV.API_BACKEND_URL, {
        withCredentials: true
    })

    socket.on("connect", ()=>{
        console.log(`socket io connect with server`);
    })
}
