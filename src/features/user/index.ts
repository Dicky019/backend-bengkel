import * as userRepo from "@features/user/user.repository";
import * as userService from "@features/user/user.service";
import userRouter from "@features/user/user.controller";

export * from "@features/user/user.schema";
export * from "@features/user/user.type";

export { userRepo, userService };

export default userRouter;
