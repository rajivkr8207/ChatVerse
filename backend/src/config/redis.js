import Redis from "ioredis";
import config from "./config.js";
import logger from "./logger.js";

export const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
})
// 
redis.on("connect", () => {
  logger.info(`redis is connected to server`);
})

redis.on('error', (err) => {
  logger.error("Error occurred with Redis connection:", err);
})