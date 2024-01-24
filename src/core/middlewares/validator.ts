import type { ValidationTargets } from "hono/types";
import { type ZodRawShape, z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { HttpStatus } from "@core/enum";
import { HTTPException } from "@core/states";

import logger from "@utils/logger";

const validatorSchemaMiddleware = <
  T extends ZodRawShape,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: z.ZodObject<T>,
) =>
  zValidator(target, schema, (result) => {
    if (!result.success) {
      logger.error(result.error.formErrors);
      logger.error(result.error.errors);
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        errors: result.error.formErrors.fieldErrors,
      });
    }
  });

export default validatorSchemaMiddleware;
