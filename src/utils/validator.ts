import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono/types";
import { type ZodRawShape, z } from "zod";
import { HttpStatus } from "./http-utils";
import { logger } from "./logger";

export const validatorSchema = <
  T extends ZodRawShape,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: z.ZodObject<T>
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      logger.error(result.error.formErrors);

      return c.json(
        {
          code: HttpStatus.BAD_REQUEST,
          status: "Bad Request",
          errors: result.error.formErrors.fieldErrors,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  });
