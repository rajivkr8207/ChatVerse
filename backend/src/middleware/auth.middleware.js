import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import config from "../config/config.js";

export const verifyUser = (req, res, next) => {
    const token = req.cookies?.chatverse_token
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
};