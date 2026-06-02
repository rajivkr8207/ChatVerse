

import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { authService } from "../services/auth.service.js";
import { generateAccessToken } from "./genrateJWTtoken.js";

export const manageAccessToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
  if (!decoded) {
    throw new Error("Invalid refresh token");
  }
  let user = await authService.findById(decoded.id);
  if (!user) {
    throw new Error("User not found");
  }
  const payload = {
    id: user._id,
    isVerified: user.isVerified,
    provider: user.provider
  };
  const accessToken = await generateAccessToken(payload);
  return accessToken;
};