import { Hono } from "hono";

import { validatorSchemaMiddleware, authMiddleware } from "@core/middlewares";
import { TVariablesUsingAuthMiddelware } from "@core/types";
import HTTPSuccess from "@core/states/success";

import type { TUser } from "@features/user";
import {
  googleCallbackSchema,
  loginSchema,
  signInSchema,
} from "@features/auth/auth.schema";

import { authService } from "@features/auth";

import type { TLoginResponse, TTokenResponse } from "@features/auth";
import logger from "@utils/logger";

const authRouter = new Hono<TVariablesUsingAuthMiddelware>();

/**
 * @route Post /auth/login
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
 * @route Post /auth/signin
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
 * @route GET /auth/me
 * @desc Get current user
 * @access Private
 */
authRouter.get("/me", authMiddleware, async (c) => {
  const { userData } = c.var;

  const user = await authService.currentUser(userData);

  const res = new HTTPSuccess<TUser>(c, {
    data: user,
  });

  return res.getResponse();
});

/**
 * @route GET /auth/refresh
 * @desc Get current user
 * @access Private
 */
authRouter.get("/refresh", authMiddleware, async (c) => {
  const { userData } = c.var;

  const newToken = await authService.refreshTokenUser(userData);

  const res = new HTTPSuccess<TTokenResponse>(c, {
    data: { token: newToken },
  });

  return res.getResponse();
});

/**
 * @route GET /auth/google/callback
 * @desc Get current user
 * @access Private
 */
authRouter.get(
  "/callback/google",
  validatorSchemaMiddleware("query", googleCallbackSchema),
  async (c) => {
    const { code, role } = c.req.valid("query");
    const { token, user } = await authService.googleCallback(code, role);

    const res = new HTTPSuccess<TLoginResponse>(c, {
      data: { token, user },
    });

    return res.getResponse();
  },
);

/**
 * @route GET /auth/google
 * @desc Get current user
 * @access Private
 */
authRouter.get("/google", (c) => {
  const authorizationUrl = authService.googleAuth();

  logger.debug({ authorizationUrl });

  return c.redirect(authorizationUrl);
});

export default authRouter;
