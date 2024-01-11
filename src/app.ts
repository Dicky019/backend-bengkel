import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { logger as log } from "hono/logger";
import { inspectRoutes } from "hono/dev";

import { env } from "~/utils/env";
import { logger } from "~/utils/logger";
import { get } from "./services/redis";
import { HttpStatus } from "./utils/http-utils";

import authRouter from "./features/auth/auth.controller";
import userRouter from "./features/user/user.controller";

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
  logger.debug("Middleware to check if data is cached in Redis")
  if (data) {
    logger.debug("Return cached data from Redis")
    // Return cached data from Redis
    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data,
    });
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
app.route("/users", userRouter);

/**
 * Node server only run in development mode
 */
if (process.env.NODE_ENV === "development") {
  const routes = inspectRoutes(app)
    .filter((v) => !v.isMiddleware)
    .map((route) => "\n" + route.method + "\t" + route.path)
    .join(" ");
  // .replace(",", "");
  logger.info(routes);
}

logger.info("server run in http://localhost:3000");

Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
})

export { app };
