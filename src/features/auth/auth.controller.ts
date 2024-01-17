import { Hono } from "hono";
import { setCookie } from "hono/cookie";

import HttpStatus from "~/utils/http-utils";

import * as authService from "./auth.service";
import { loginSchema, signInSchema } from "./auth.schema";
import validatorSchemaMiddleware from "~/middlewares/validator";
import { authMiddleware } from "~/middlewares/auth";

const authRouter = new Hono();

/**
 * @route Post /auth/my
 * @desc Login user
 * @access Public
 */
authRouter.post(
  "/login",
  validatorSchemaMiddleware("json", loginSchema),
  async (c) => {
    const login = c.req.valid("json");

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
  },
);

/**
 * @route Post /auth/my
 * @desc Sign-in user
 * @access Public
 */
authRouter.post(
  "/signin",
  validatorSchemaMiddleware("json", signInSchema),
  async (c) => {
    const user = c.req.valid("json");
    const newUser = await authService.signin(user);
    return c.json({
      code: HttpStatus.OK,
      status: "Ok",
      data: newUser,
    });
  },
);

/**
 * @route GET /auth/my
 * @desc Get current user
 * @access Private
 */
authRouter.get("/my", authMiddleware, async (c) => {
  const { userData } = c.var;

  const user = await authService.currentUser(userData);
  return c.json({
    code: HttpStatus.OK,
    status: "Ok",
    data: user,
  });
});

export default authRouter;
