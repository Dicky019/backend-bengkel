import { Hono } from "hono";

import { validatorSchemaMiddleware, authMiddleware } from "@core/middlewares";
import { TVariablesUsingAuthMiddelware } from "@core/types";
import HTTPSuccess from "@core/states/success";

import type { TUser } from "@features/user";
import { loginSchema, signInSchema } from "@features/auth/auth.schema";

import { type TLoginResponse, authService } from "@features/auth";
// import * as authService from "@features/auth/auth.service";
// import * as authService from "./auth.service";
// import { loginSchema, signInSchema } from "./auth.schema";
// import { TLoginResponse } from "./auth.type";

const authRouter = new Hono<TVariablesUsingAuthMiddelware>();

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

    const res = new HTTPSuccess<TLoginResponse>(c, {
      data: { user, token },
    });

    return res.getResponse();
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

    const res = new HTTPSuccess<TUser>(c, {
      data: newUser,
    });

    return res.getResponse();
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

  const res = new HTTPSuccess<TUser>(c, {
    data: user,
  });

  return res.getResponse();
});

export default authRouter;
