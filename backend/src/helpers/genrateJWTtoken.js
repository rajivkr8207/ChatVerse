import jwt from 'jsonwebtoken'
import config from '../config/config.js';


export const genrateJWTtoken = (payload) => {
    const token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: "7d"
    });
    return token
}
