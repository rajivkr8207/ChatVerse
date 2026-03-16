import { io } from "socket.io-client";


export const initializeSocketconnection = ()=>{

    const socket = io('http://localhost:8000', {
        withCredentials: true
    })

    socket.on("connect", ()=>{
        console.log(`socket io connect with server`);
    })
}
