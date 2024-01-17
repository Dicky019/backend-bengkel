import { Redis } from "@upstash/redis";
import { Context } from "hono";
import env from "~/utils/env";

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

export const setCache = (c: Context, value: unknown) =>
  redis.set(c.req.url, value);

export const removeCache = (c: Context) => redis.del(c.req.url);

export const get = (c: Context) => redis.get(c.req.url);
