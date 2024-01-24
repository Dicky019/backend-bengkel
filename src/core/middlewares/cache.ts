import { type MiddlewareHandler } from "hono";

import { removeCache, get } from "@core/services";
import { HttpStatus } from "@core/enum";

import type { TUser } from "@features/user/user.type";

import logger from "@utils/logger";
import getStatusName from "@utils/http-utils";

const cacheMiddleware: MiddlewareHandler<{
  Variables: {
    userData: Omit<TUser, "createdAt" | "updatedAt">;
  };
}> = async (c, next) => {
  logger.debug({ method: c.req.method });
  const method = c.req.method as "POST" | "PUT" | "DELETE" | "PATCH" | "GET";

  if (method === "GET") {
    const data = await get(c);

    logger.debug(data);

    logger.info("Middleware to check if data is cached in Redis");
    if (data) {
      logger.info("Return cached data from Redis");
      // Return cached data from Redis
      return c.json({
        code: HttpStatus.OK,
        status: getStatusName(HttpStatus.OK),
        ...data,
      });
    }
    return next();
  }
  await removeCache(c);

  return next();
};

export default cacheMiddleware;
