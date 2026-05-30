import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import AuthRouter from "./routes/auth.route.js";
import ChatRouter from "./routes/chat.route.js";
import { Middleware } from "./app.middleware.js";
import AdminRouter from "./routes/admin.route.js";
import path from "path";
const app = express()


// midleware
Middleware(app)
app.get('/health', (req, res) => {
    return res.status(200).json({
        message: "your server health is Correct correctly"
    })
})



app.use('/api/auth', AuthRouter)
app.use("/api/chat", ChatRouter);
app.use("/api/admin", AdminRouter);

//fallback to index.html for all routes (client-side routing)
app.get(/^((?!api\/).*)$/, (req, res) => {
    res.sendFile(path.resolve("public/dist", "index.html"));
});
app.use(errorHandler);
export default app;