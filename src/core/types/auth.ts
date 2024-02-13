import { TUser } from "@features/user";
import { $Enums } from "@prisma/client";

export type TVariablesUsingAuthMiddelware = {
  Variables: { userData: TUser };
};

declare module "jsonwebtoken" {
  interface JwtPayload extends TUser {}
}
export type TAuthMiddleware = $Enums.Role[] | undefined;

export type TJWTError = {
  tokenExpired: string;
  tokenWrong: string;
};
