import { ZodError } from "zod";

export const formatErrorsFromZod = <T>(zodErrors: ZodError<T>) => {
  const errors = zodErrors.errors.map((e) => e.message);

  // const consolidatedErrors = errors.reduce((acc, error) => {
  //   for (const key in error) {
  //     if (!acc[key]) {
  //       acc[key] = [];
  //     }
  //     acc[key].push(...error[key]);
  //   }
  //   return acc;
  // }, {});

  // const result = Object.entries(consolidatedErrors).map(([key, messages]) => ({
  //   [key]: messages,
  // }));

  return errors;
};
