import { z } from "zod";
import { loginSchema, signInSchema } from "./auth.schema";

export type TLoginProps = z.infer<typeof loginSchema>;
export type TSigninProps = z.infer<typeof signInSchema>;
