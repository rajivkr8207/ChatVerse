import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import config from "../config/config.js";
import { authService } from "../services/auth.service.js";
import { redis } from "../config/redis.js";

export const verifyUser = async (req, res, next) => {
    const token = req.cookies?.chatverse_access_token

    const blacklisted = await redis.get(
        `blacklist:${token}`
    );

    if (blacklisted) {
        return res.status(401).json({
            message: "Token revoked"
        });
    }
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = await authService.findById(decoded.id);
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
};