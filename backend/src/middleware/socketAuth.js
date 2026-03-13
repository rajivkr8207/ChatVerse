import jwt from "jsonwebtoken";
import config from "../config/config.js";
import cookie from "cookie";

export const socketAuth = async (socket, next) => {
    try {

        const cookies = socket.handshake.headers.cookie;

        const parsed = cookie.parse(cookies);

        const token = parsed.token;
        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        socket.user = decoded;

        next();

    } catch (err) {

        next(new Error("Authentication failed"));

    }

};