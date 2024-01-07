import { Redis } from "@upstash/redis";
import { Context } from "hono";
import { env } from "~/utils/env";

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

export const set = (c: Context, value: any) => {
  const data = JSON.stringify(value);
  return redis.set(c.req.path, data, {
    ex: 60 * 2, // 2 minutes,
  });
};

export const get = (c: Context) => {
  return redis.get<JSON>(c.req.path);
};
