import { Context, Hono, Next } from "hono";

import { HttpStatus } from "~/utils/http-utils";
import { logger } from "~/utils/logger";

import * as userService from "./user.service";
import { updateUserSchema } from "./user.schema";
import { validatorSchema } from "~/utils/validator";
import { idSchema, queryPageSchema } from "~/schemas";
import { setCache, removeCache, get } from "~/services/redis";

const userRouter = new Hono();

const cache = async (c: Context, next: Next) => {
  const data = await get(c);

  logger.info({ data });

  logger.debug("Middleware to check if data is cached in Redis");
  if (data) {
    logger.debug("Return cached data from Redis");
    // Return cached data from Redis
    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      ...data,
    });
  }
  return next();
};

/**
 * Middleware to check if data is cached in Redis
 * If cached data exists, return it
 * Otherwise call next() to continue request processing
 */
userRouter.use("*", async (c, next) => {
  logger.debug({ method: c.req.method });
  const method = c.req.method as "POST" | "PUT" | "DELETE" | "PATCH" | "GET";

  if (method === "GET") {
    return await cache(c, next);
  } else {
    await removeCache(c);
  }

  return next();
});

userRouter.get("/", async (c) => {
  const query = c.req.query();

  const queryPage = queryPageSchema.parse(query);
  const users = await userService.getUsers(queryPage);
  await setCache(c, users);

  return c.json({
    code: HttpStatus.OK,
    status: "Ok",
    ...users,
  });
});

userRouter.get("/:id", validatorSchema("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");

  const user = await userService.getUser({ id });

  await setCache(c, { data: user });

  return c.json({
    code: HttpStatus.OK,
    status: "Ok",
    data: user,
  });
});

userRouter.put(
  "/:id",
  validatorSchema("json", updateUserSchema),
  validatorSchema("param", idSchema),
  async (c) => {
    const userWithoutId = c.req.valid("json");
    const { id } = c.req.valid("param");
    const user = await userService.updateUser({
      id,
      ...userWithoutId,
    });

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: user,
    });
  }
);

userRouter.delete("/:id", validatorSchema("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");

  const user = await userService.deleteUser({ id });

  return c.json({
    code: HttpStatus.OK,
    status: "Ok",
    data: user,
  });
});

export default userRouter;
