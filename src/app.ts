import { Hono } from "hono";
import { env } from "~/utils/env";
import { logger as log } from "hono/logger";
import { logger } from "~/utils/logger";
import { secureHeaders } from "hono/secure-headers";
import { get } from "./services/redis";
import { HttpStatus } from "./utils/http-utils";
import authRouter from "./features/auth/auth.controller";
import { serve } from '@hono/node-server'

const app = new Hono();

/**
 * Headers secure
 * Using Hono/secure-headers
 */
app.use("*", secureHeaders());

/**
 * Logger middleware to log requests
 * Using Winston Loggger
 */
app.use(
  "*",
  log((str) => {
    logger.info(str);
  })
);

/**
 * Handle unknown errors
 */
app.onError((err, c) => {
  logger.error({ error: err });
  return c.json({ error: err.message }, HttpStatus.SERVER_ERROR);
});

/**
 * Middleware to check if data is cached in Redis
 * If cached data exists, return it
 * Otherwise call next() to continue request processing
 */
app.use("*", async (c, next) => {
  const data = await get(c);
  if (data) {
    // Return cached data from Redis
    return c.json(data);
  }
  // Data not cached, continue processing
  return next();
});

/**
 * Routes auth: 
 * - /login 
 * - /signin 
 */
app.route("/auth", authRouter);

/**
 * Node server only run in development mode
 */
serve({
  fetch: app.fetch,
  port: env.PORT,
})



export { app };
