import { z } from "zod";
import { loginSchema, signinSchema } from "./auth.schema";

export type ILoginProps = z.infer<typeof loginSchema>;
export type ISigninProps = z.infer<typeof signinSchema>;
