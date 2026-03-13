import crypto from "crypto";

export const generateVerificationToken = () => {

  const token = crypto.randomBytes(32).toString("hex");

  const tokenExpire = Date.now() + 1000 * 60 * 60; // 1 hour

  return { token, tokenExpire };
};