import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  tls: process.env.REDIS_URL?.includes("rediss://") ? { rejectUnauthorized: false } : undefined, // Enable TLS for production
});

export default redis;