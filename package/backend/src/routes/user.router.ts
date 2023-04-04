import { Router } from "express";
import { UserController } from "../controller/user.controller";

const userRouter = Router();
const controller = new UserController();

userRouter.get("/:id", controller.getUserByID);
userRouter.get("/", controller.getAllUsers);

export default userRouter;
