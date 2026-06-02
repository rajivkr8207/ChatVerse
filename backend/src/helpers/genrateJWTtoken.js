import jwt from 'jsonwebtoken'
import config from '../config/config.js';
import logger from '../config/logger.js';


export const genrateJWTtokenSaveCookie = async (payload, res) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const cookieOptions = {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict",
    };
    res.cookie("chatverse_access_token", accessToken, cookieOptions);
    res.cookie("chatverse_refresh_token", refreshToken, cookieOptions);
}

export const generateAccessToken = (payload) => {
    const options = {
        expiresIn: "1m",
    };
    return jwt.sign(payload, config.JWT_SECRET, options);
};

export const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: "7d",
    };
    return jwt.sign(payload, config.JWT_SECRET, options);
};