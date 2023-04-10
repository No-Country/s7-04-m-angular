import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { hasRole } from "../middlewares/security/hasRole";
import { auth } from "../middlewares/security/auth";
import { getAllUsersV } from "../middlewares/validators/user.validator";

const userRouter = Router();
const controller = new UserController();

userRouter.use(auth,hasRole("admin"));
userRouter.get("/:id", controller.getUserByID.bind(controller));
userRouter.get("/",getAllUsersV, controller.getAllUsers.bind(controller));

export default userRouter;
