import { Context, Hono, Next } from "hono";

import { HttpStatus } from "~/utils/http-utils";
import { logger } from "~/utils/logger";

import * as userService from "./user.service";
import { createUserSchema, updateUserSchema } from "./user.schema";
import { validatorSchema } from "~/utils/validator";
import { idSchema, queryPageSchema } from "~/schemas";
import { setCache, removeCache, get } from "~/services/redis";

const userRouter = new Hono();

const cache = async (c: Context, next: Next) => {
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

export const getUsersRouter = userRouter.get("/", async (c) => {
  const query = c.req.query();

  const queryPage = queryPageSchema.parse(query);
  const users = await userService.getUsers(queryPage);
  await setCache(c, users);

  logger.debug(users);

  return c.json({
    code: HttpStatus.OK,
    status: "Ok",
    ...users,
  });
});

export const getUserByIdRouter = userRouter.get(
  "/:id",
  validatorSchema("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await userService.getUser({ id });
    await setCache(c, { data: user });

    logger.debug(user);

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: user,
    });
  }
);

export const createUserRouter = userRouter.post(
  "/",
  validatorSchema("json", createUserSchema),
  async (c) => {
    const data = c.req.valid("json");
    const user = await userService.createUser(data);

    logger.debug(user);

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: user,
    });
  }
);

export const updateUserRouter = userRouter.put(
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

    logger.debug(user);

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: user,
    });
  }
);

export const deleteUserRouter = userRouter.delete(
  "/:id",
  validatorSchema("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await userService.deleteUser({ id });
    logger.debug(user);

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: user,
    });
  }
);

export const ts = userRouter;

export default userRouter;
