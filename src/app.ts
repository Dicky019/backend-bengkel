import { Hono } from "hono";
import { inspectRoutes } from "hono/dev";
import { logger as log } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { HTTPException } from "hono/http-exception";

import env from "~/utils/env";
import logger from "~/utils/logger";
import HttpStatus from "~/utils/http-utils";

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
  }),
);

/**
 * Handle unknown errors
 */
app.onError((err, c) => {
  const { message } = err;
  // discovered errors
  if (err instanceof HTTPException) {
    logger.debug({ error: message });
    // Get the custom response
    return c.json(
      {
        code: err.status,
        status: "Server Error",
        errors: [message],
      },
      err.status,
    );
  }
  // unnoticed error
  logger.error({ error: err });
  return c.json(
    {
      code: HttpStatus.SERVER_ERROR,
      status: "Server Error",
      errors: [message],
    },
    HttpStatus.SERVER_ERROR,
  );
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
    .map((route) => `\n${route.method}\t${route.path}`)
    .join(" ");
  // .replace(",", "");
  logger.info(routes);
}

logger.info("server run in http://localhost:3000");

Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
});

export default app;
