import http  from "http";
import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";
const PORT = config.PORT

const httpserver = http.createServer(app);

initSocket(httpserver)

connectDB()
httpserver.listen(PORT, () => {
    console.log(`server is running on ${PORT} port`);
})








