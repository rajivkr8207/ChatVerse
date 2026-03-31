import morgan from "morgan";
import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import AuthRouter from "./routes/auth.route.js";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import ChatRouter from "./routes/chat.route.js";
const app = express()


// midleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173','http://localhost:8000','http://127.0.0.1:8000'],
    credentials: true
}))
app.use(express.static('./public'))



app.get('/health', (req, res) => {
    return res.status(200).json({
        message: "your server health is Correct correctly"
    })
})
app.use('/api/auth', AuthRouter)
app.use("/api/chat", ChatRouter);

app.use(errorHandler);
export default app;