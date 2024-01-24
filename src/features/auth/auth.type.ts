import { z } from "zod";

import { TUser } from "@features/user/user.type";

import { loginSchema, signInSchema } from "./auth.schema";

export type TLoginProps = z.infer<typeof loginSchema>;
export type TSigninProps = z.infer<typeof signInSchema>;
export type TCurentUserProps = {
  id: string;
  email: string;
};

export type TLoginResponse = {
  user: TUser;
  token: string;
};

export type TAuthError = {
  auth?: string[];
  token?: string[];
  email?: string[];
  password?: string[];
};
