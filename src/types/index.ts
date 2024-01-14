import { z } from "zod";
import { idSchema, queryPageSchema } from "~/schemas";

export type TQueryPage = z.infer<typeof queryPageSchema>;
export type TId = z.infer<typeof idSchema>;
