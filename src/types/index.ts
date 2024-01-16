import type { Context, Next } from "hono";
import { z } from "zod";
import { TUser } from "~/features/user/user.type";
import { idSchema, queryPageSchema } from "~/schemas";

export type TQueryPage = z.infer<typeof queryPageSchema>;
export type TId = z.infer<typeof idSchema>;
export type TMiddleware = {
  c: Context;
  next: Next;
};

export type TVariables = {
  userData: Omit<TUser, "createdAt" | "updatedAt">;
};
