import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import { Middleware } from "./app.middleware.js";
import path from "path";
import HealthRouter from "./routes/healthcheck.route.js";
import AuthRouter from "./routes/auth.route.js";
import ChatRouter from "./routes/chat.route.js";
const app = express()


// midleware
Middleware(app)
app.get('/health', (req, res) => {
    return res.status(200).json({
        message: "your server health is Correct correctly"
    })
})



app.use('/api/health', HealthRouter)
app.use('/api/auth', AuthRouter)
app.use("/api/chat", ChatRouter);
app.get(/^((?!api\/).*)$/, (req, res, next) => {
    if (req.accepts && req.accepts('html')) {
        return res.sendFile(path.resolve("./public/dist", "index.html"));
    }
    return res.status(404).end();
});
app.use(errorHandler);
export default app;