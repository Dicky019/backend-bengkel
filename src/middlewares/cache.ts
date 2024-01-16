import { logger } from "~/utils/logger";

import { removeCache, get } from "~/services/redis";
import { HttpStatus } from "~/utils/http-utils";
import type { MiddlewareHandler } from "hono";
import type { TUser } from "~/features/user/user.type";
import type { TMiddleware } from "~/types";

const cache = async ({ c, next }: TMiddleware) => {
  const data = await get(c);

  logger.debug(data);

  logger.info("Middleware to check if data is cached in Redis");
  if (data) {
    logger.info("Return cached data from Redis");
    // Return cached data from Redis
    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      ...data,
    });
  }
  return next();
};

const cacheMiddleware: MiddlewareHandler<{
  Variables: {
    userData: Omit<TUser, "createdAt" | "updatedAt">;
  };
}> = async (c, next) => {
  logger.debug({ method: c.req.method });
  const method = c.req.method as "POST" | "PUT" | "DELETE" | "PATCH" | "GET";

  if (method === "GET") {
    return await cache({ c, next });
  } else {
    await removeCache(c);
  }

  return next();
};

export default cacheMiddleware;
