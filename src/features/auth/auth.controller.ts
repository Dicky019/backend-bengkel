import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { HttpStatus } from "~/utils/http-utils";
import { logger } from "~/utils/logger";

import * as authService from "./auth.service";
import { loginSchema } from "./auth.schema";
import { createUserSchema } from "~/features/user/user.schema";
import { validatorSchema } from "~/utils/validator";

const authRouter = new Hono();

/**
 * @route Post /auth/my
 * @desc Login user
 * @access Public
 */
authRouter.post("/login", validatorSchema("json", loginSchema), async (c) => {
  const login = c.req.valid("json");

  try {
    const { userWithoutPassword: user, token } = await authService.login(login);
    setCookie(c, "token", token, {
      maxAge: 3 * 24 * 60 * 60,
    });

    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: {
        user,
        token,
      },
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

/**
 * @route Post /auth/my
 * @desc Sign-in user
 * @access Public
 */
authRouter.post(
  "/signin",
  validatorSchema("json", createUserSchema),
  async (c) => {
    const user = c.req.valid("json");
    try {
      const newUser = await authService.signin(user);
      return c.json({
        code: HttpStatus.OK,
        status: "Ok",
        data: newUser,
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

/**
 * @route GET /auth/my
 * @desc Get current user
 * @access Private
 */
authRouter.get("/my", async (c) => {
  const token = getCookie(c, "token");

  try {
    const user = authService.currentUser(token);
    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: user,
    });
  } catch (error) {
    const { message } = error as { message: string };
    return c.json(
      {
        code: HttpStatus.UNAUTHORIZED,
        status: "Unauthorized",
        errors: [message],
      },
      HttpStatus.UNAUTHORIZED
    );
  }
});

export default authRouter;
