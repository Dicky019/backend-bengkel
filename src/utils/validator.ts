import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono/types";
import { type ZodRawShape, z } from "zod";
import { formatErrorsFromZod } from "./format-errors";
import { HttpStatus } from "./http-utils";

export const validatorSchema = <
  T extends ZodRawShape,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: z.ZodObject<T>
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const errors = formatErrorsFromZod(result.error);

      return c.json(
        {
          code: HttpStatus.BAD_REQUEST,
          status: "Bad Request",
          errors: errors,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  });
