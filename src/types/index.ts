import { z } from "zod";
import { queryPageSchema } from "~/schemas";

export type IQueryPage = z.infer<typeof queryPageSchema>;
