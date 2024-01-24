import * as authService from "@features/auth/auth.service";
import authRouter from "@features/auth/auth.controller";

export * from "@features/auth/auth.schema";
export * from "@features/auth/auth.type";

export { authService };

export default authRouter;
