import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { HttpStatus } from "~/utils/http-utils";

import * as authService from "./auth.service";
import { loginSchema, signInSchema } from "./auth.schema";
import { validatorSchema } from "~/utils/validator";

const authRouter = new Hono();

/**
 * @route Post /auth/my
 * @desc Login user
 * @access Public
 */
authRouter.post("/login", validatorSchema("json", loginSchema), async (c) => {
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
});

/**
 * @route Post /auth/my
 * @desc Sign-in user
 * @access Public
 */
authRouter.post("/signin", validatorSchema("json", signInSchema), async (c) => {
  const user = c.req.valid("json");
  const newUser = await authService.signin(user);
  return c.json({
    code: HttpStatus.OK,
    status: "Ok",
    data: newUser,
  });
});

/**
 * @route GET /auth/my
 * @desc Get current user
 * @access Private
 */
authRouter.get("/my", async (c) => {
  const token = getCookie(c, "token");

  const user = await authService.currentUser(token);
  return c.json({
    code: HttpStatus.OK,
    status: "Ok",
    data: user,
  });
});

export default authRouter;
