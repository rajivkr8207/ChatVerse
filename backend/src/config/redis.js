import Redis from "ioredis";
import config from "./config.js";
import logger from "./logger.js";

const password =
  config.REDIS_PASSWORD && config.REDIS_PASSWORD !== "undefined"
    ? config.REDIS_PASSWORD
    : undefined;

const port = config.REDIS_PORT ? Number(config.REDIS_PORT) : undefined;

const useTls =
  (config.REDIS_USE_TLS && config.REDIS_USE_TLS === "true") || port === 15670;

const redisOptions = {
  host: config.REDIS_HOST || undefined,
  port,
  password,
  maxRetriesPerRequest: null,
};

if (useTls) {
  // enable TLS for providers like RedisLabs (port 15670)
  redisOptions.tls = { rejectUnauthorized: false };
}

export const redis = new Redis(redisOptions);

redis.on("connect", () => {
  logger.info("Redis connected to server");
});

redis.on("ready", () => {
  logger.info("Redis connection is ready");
});

redis.on("error", (err) => {
  logger.error("Error occurred with Redis connection:", err?.message || err);
});

redis.on("end", () => {
  logger.warn("Redis connection closed");
});