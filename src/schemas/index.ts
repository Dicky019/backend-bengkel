import { z } from "zod";

export const idSchema = z.object({
  id: z.string().min(1, "Id harus diisi").uuid(),
});

export const queryPageSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
});
