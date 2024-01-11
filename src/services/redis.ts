import { Redis } from "@upstash/redis";
import { Context } from "hono";
import { env } from "~/utils/env";

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

export const setCache = (c: Context, value: any) => {
  const data = JSON.stringify(value);
  return redis.set(c.req.url, data);
};

export const removeCache = (c: Context) => {
  return redis.del(c.req.path);
};

export const get = (c: Context) => {
  return redis.get<JSON>(c.req.url);
};
