import { Hono } from "hono";

import { HttpStatus } from "~/utils/http-utils";
import { logger } from "~/utils/logger";

import * as userService from "./user.service";
import { createUserSchema, updateUserSchema } from "./user.schema";
import { idSchema, queryPageSchema } from "~/schemas";
import { setCache } from "~/services/redis";
import validatorSchemaMiddleware from "~/middlewares/validator";
import cacheMiddleware from "~/middlewares/cache";
import { authMiddleware, authAdminMiddleware } from "~/middlewares/auth";
import type { TVariables } from "~/types";

const userRouter = new Hono<{ Variables: TVariables }>();

/**
 * Middleware to check if data is cached in Redis
 * If cached data exists, return it
 * Otherwise call next() to continue request processing
 */
userRouter.use("*", authMiddleware);
userRouter.use("*", cacheMiddleware);

export const getUsersRouter = userRouter.get(
  "/",
  // (c, next) => authAdminMiddleware("admin", c, next),
  async (c) => {
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
  }
);

export const getUserByIdRouter = userRouter.get(
  "/:id",
  validatorSchemaMiddleware("param", idSchema),
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
  validatorSchemaMiddleware("json", createUserSchema),
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
  validatorSchemaMiddleware("json", updateUserSchema),
  validatorSchemaMiddleware("param", idSchema),
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
  validatorSchemaMiddleware("param", idSchema),
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
