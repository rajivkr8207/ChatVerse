import morgan from "morgan";
import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import AuthRouter from "./routes/auth.route.js";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import ChatRouter from "./routes/chat.route.js";
import config from "./config/config.js";
const app = express()


// midleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
    origin: [config.CORSORIGIN1, config.CORSORIGIN2],
    credentials: true
}))
app.use(express.static('./public/dist'))

app.get('/health', (req, res) => {
    return res.status(200).json({
        message: "your server health is Correct correctly"
    })
})



app.use('/api/auth', AuthRouter)
app.use("/api/chat", ChatRouter);

app.use(errorHandler);
export default app;