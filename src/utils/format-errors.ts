import { ZodError } from "zod";

export const formatErrorsFromZod = <T>(zodErrors: ZodError<T>) => {
  const errors = zodErrors.errors.map((e) => e.message);

  return errors;
};
