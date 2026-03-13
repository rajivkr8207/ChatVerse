import http  from "http";
import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/database.js";
import { chatSocket } from "./src/sockets/chat.socket.js";
import { initSocket } from "./src/config/socket.js";
const PORT = config.PORT

const server = http.createServer(app);

const io = initSocket(server);

chatSocket(io);


connectDB()
server.listen(PORT, () => {
    console.log(`server is running on ${PORT} port`);
})








