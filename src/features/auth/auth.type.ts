import { z } from "zod";
import { loginSchema } from "./auth.schema";
import { createUserSchema } from "~/features/user/user.schema";

export type ILoginProps = z.infer<typeof loginSchema>;
export type ISigninProps = z.infer<typeof createUserSchema>;
