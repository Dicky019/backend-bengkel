import { Hono } from "hono";
import { setCookie } from "hono/cookie";

import { HttpStatus } from "~/utils/http-utils";
import { formatErrorsFromZod } from "~/utils/format-errors";
import { logger } from "~/utils/logger";

import * as authService from "./auth.service";
import { loginSchema, signinSchema } from "./auth.schema";

const authRouter = new Hono();

/**
 * Login handler
 *
 * @body {
 *   "email": string,
 *   "password": string
 * }
 *
 * @error {
 *   "code": 400,
 *   "status": "Bad Request",
 *   "errors": string[]
 * }
 *
 * @succses {
 * "code": 200,
 * "status": "Ok",
 * "data": {
 *    "user": {
 *      "id": string,
 *      "name": string,
 *      "email": string,
 *      "nomorTelephone": string,
 *      "role": "pengendara" | "motir" | "admin"
 *    },
 *    "token": string,
 *  }
 * }
 */
authRouter.post("/login", async (c) => {
  const req = await c.req.json();
  const reqParse = loginSchema.safeParse(req);

  if (!reqParse.success) {
    const errors = formatErrorsFromZod(reqParse.error);

    return c.json(
      {
        code: HttpStatus.BAD_REQUEST,
        status: "Bad Request",
        errors: errors,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    const { userWithoutPassword: user, token } = await authService.login(
      reqParse.data
    );
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
 * Sign in handler
 *
 * @body {
 *   "name": string,
 *   "email": string,
 *   "password": string,
 *   "nomorTelephone": string,
 *   "role": "pengendara" | "motir" | "admin"
 * }
 *
 * @error {
 *   "code": 400,
 *   "status": "Bad Request",
 *   "errors": string[]
 * }
 *
 * @succses {
 * "code": 200,
 * "status": "Ok",
 * "data": {
 *     "id": string,
 *     "name": string,
 *     "email": string,
 *     "password": string,
 *     "nomorTelephone": string,
 *     "role": "pengendara" | "motir" | "admin"
 *   },
 * }
 */
authRouter.post("/signin", async (c) => {
  const req = await c.req.json();
  const reqParse = signinSchema.safeParse(req);

  if (!reqParse.success) {
    const errors = formatErrorsFromZod(reqParse.error);

    return c.json(
      {
        code: HttpStatus.BAD_REQUEST,
        status: "Bad Request",
        errors: errors,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    const newUser = await authService.signin({
      ...reqParse.data,
      role: "pengendara",
    });
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
});

export default authRouter;
