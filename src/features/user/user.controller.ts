import { Hono } from "hono";

import {
  validatorSchemaMiddleware,
  cacheMiddleware,
  authMiddleware,
} from "@core/middlewares";
import { idSchema, queryPageSchema } from "@core/schemas";
import type { TVariablesUsingAuthMiddelware } from "@core/types";
import { setCache } from "@core/services";
import { HttpStatusSuccess } from "@core/enum";
import HTTPSuccess from "@core/states/success";

import getStatusName from "@utils/http-utils";
import logger from "@utils/logger";

import { createUserSchema, updateUserSchema } from "@features/user/user.schema";
import * as userService from "@features/user/user.service";
import { TUser } from "@features/user/user.type";

const userRouter = new Hono<TVariablesUsingAuthMiddelware>();

/**
 * Middleware to check if data is cached in Redis
 * If cached data exists, return it
 * Otherwise call next() to continue request processing
 */
userRouter.use("*", authMiddleware);
userRouter.use("*", (...c) => authMiddleware(...c, ["admin", "motir"]));
userRouter.use("*", cacheMiddleware);

userRouter.get(
  "/",
  // (c, next) => authAllowedRolesMiddleware("admin", c, next),
  async (c) => {
    const query = c.req.query();

    const queryPage = queryPageSchema.parse(query);
    const { data, meta } = await userService.getUsers(queryPage);
    await setCache(c, { data, meta });

    logger.debug({ data, meta });

    const res = new HTTPSuccess<TUser[]>(c, { data, meta });

    return res.getResponse();
  },
);

userRouter.get(
  "/:id",
  validatorSchemaMiddleware("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await userService.getUser({ id });
    await setCache(c, { data: user });

    logger.debug(user);

    const res = new HTTPSuccess<TUser>(c, {
      data: user,
    });

    return res.getResponse();
  },
);
userRouter.post(
  "/",
  validatorSchemaMiddleware("json", createUserSchema),
  async (c) => {
    const data = c.req.valid("json");
    const user = await userService.createUser(data);

    logger.debug(user);

    const res = new HTTPSuccess<TUser>(c, {
      code: HttpStatusSuccess.CREATED,
      data: user,
    });

    return res.getResponse();
  },
);

userRouter.put(
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
      code: HttpStatusSuccess.OK,
      status: getStatusName(HttpStatusSuccess.OK),
      data: user,
    });
  },
);

userRouter.delete(
  "/:id",
  validatorSchemaMiddleware("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await userService.deleteUser({ id });
    logger.debug(user);

    const res = new HTTPSuccess<TUser>(c, {
      data: user,
    });

    return res.getResponse();
  },
);

export default userRouter;
