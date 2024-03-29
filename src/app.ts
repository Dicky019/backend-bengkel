import { Hono } from "hono";
import { inspectRoutes } from "hono/dev";
import { logger as log } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import env from "@utils/env";
import logger from "@utils/logger";
import getStatusName from "@utils/http-utils";

import { HTTPException } from "@core/states";
import { HttpStatus } from "@core/enum";

import authRouter from "@features/auth";
import userRouter from "@features/user";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api");

app.use("*", cors());

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
    return c.json(err.getResponse(), err.code);
  }
  // unnoticed error
  logger.error({ error: err });
  return c.json(
    {
      code: HttpStatus.SERVER_ERROR,
      status: getStatusName(HttpStatus.SERVER_ERROR),
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
app.get("/", (c) =>
  c.json({
    server: "online",
  }),
);
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

logger.info(`server run in http://localhost:${env.PORT}`);

Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
});
