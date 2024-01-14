import { Redis } from "@upstash/redis";
import { Context } from "hono";
import { env } from "~/utils/env";

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

export const setCache = (c: Context, value: any) => {
  return redis.json.set(c.req.path,"$", value);
};

export const removeCache = (c: Context) => {
  return redis.json.forget(c.req.path);
};

export const get = (c: Context) => {
  return redis.json.get(c.req.path);
};
