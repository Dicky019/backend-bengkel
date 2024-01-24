import { z } from "zod";
import { idSchema, queryPageSchema } from "@core/schemas";

export type TQueryPage = z.infer<typeof queryPageSchema>;
export type TId = z.infer<typeof idSchema>;
export type IGetDataPagination = { take: number; skip: number };
