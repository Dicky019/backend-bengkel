import type { TUser } from "@features/user";
import { $Enums } from "@prisma/client";

export type TVariablesUsingAuthMiddelware = {
  Variables: { userData: Omit<TUser, "createdAt" | "updatedAt"> };
};

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: string;
    name: string;
    email: string;
    image: string | null;
    nomorTelephone: string;
    role: $Enums.Role;
  }
}
export type TAuthMiddleware = $Enums.Role[] | undefined;

export type TJWTError = {
  tokenExpired: string;
  tokenWrong: string;
};
