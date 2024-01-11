import { Hono } from "hono";

import { HttpStatus } from "~/utils/http-utils";
import { logger } from "~/utils/logger";

import * as userService from "./user.service";
import { updateUserSchema } from "./user.schema";
import { validatorSchema } from "~/utils/validator";
import { idSchema, queryPageSchema } from "~/schemas";
import { setCache, removeCache, get } from "~/services/redis";

const userRouter = new Hono();

/**
 * Middleware to check if data is cached in Redis
 * If cached data exists, return it
 * Otherwise call next() to continue request processing
 */
userRouter.use("*", async (c, next) => {
  const data = await get(c);
  logger.debug("Middleware to check if data is cached in Redis");
  if (data) {
    logger.debug("Return cached data from Redis");
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

// userRouter.use(async (_, next) => {
//   console.log("middleware 1 start");
//   await next();
//   console.log("middleware 1 end");
// });

userRouter.get("/", async (c) => {
  const query = c.req.query();

  const queryPage = queryPageSchema.parse(query);
  try {
    const users = await userService.getUsers(queryPage);
    await setCache(c, users);

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: users,
    });
  } catch (error) {
    const { message } = error as { message: string };
    logger.error({ error: message });
    return c.json(
      {
        code: HttpStatus.BAD_REQUEST,
        status: "Bad Request",
        errors: [message],
      },
      HttpStatus.BAD_REQUEST
    );
  }
});

userRouter.get("/:id", validatorSchema("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");

  try {
    const user = await userService.getUser({ id });

    await setCache(c, user);

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: user,
    });
  } catch (error) {
    const { message } = error as { message: string };
    return c.json(
      {
        code: HttpStatus.BAD_REQUEST,
        status: "Bad Request",
        errors: [message],
      },
      HttpStatus.BAD_REQUEST
    );
  }
});

userRouter.put(
  "/:id",
  validatorSchema("json", updateUserSchema),
  validatorSchema("param", idSchema),
  async (c) => {
    const userWithoutId = c.req.valid("json");
    const { id } = c.req.valid("param");
    try {
      const user = await userService.updateUser({
        id,
        ...userWithoutId,
      });

      await removeCache(c);

      return c.json({
        code: HttpStatus.OK,
        status: "Ok",
        data: user,
      });
    } catch (error) {
      const { message } = error as { message: string };
      return c.json(
        {
          code: HttpStatus.BAD_REQUEST,
          status: "Bad Request",
          errors: [message],
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
);

userRouter.delete("/:id", validatorSchema("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");

  try {
    const user = await userService.deleteUser({ id });

    await removeCache(c);

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: user,
    });
  } catch (error) {
    const { message } = error as { message: string };
    return c.json(
      {
        code: HttpStatus.BAD_REQUEST,
        status: "Bad Request",
        errors: [message],
      },
      HttpStatus.BAD_REQUEST
    );
  }
});

export default userRouter;
