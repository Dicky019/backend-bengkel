import { Hono } from "hono";
import { env } from "hono/adapter";
import { Env } from "./types";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://upright-chigger-40378.upstash.io",
  token: "********",
});

// import {server} from ""

const app = new Hono().basePath("api/");

app.get("/", (c) => c.json({ message: "Hello Hono!" }));

app.get("/env", (c) => {
  const { DATABASE_URL } = env<Env>(c);
  return c.json({ message: DATABASE_URL });
});

Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});

export { app };
