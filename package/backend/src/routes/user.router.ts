import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { loginValidate } from "../middlewares/validators/loginValidate";
import { registerValidate } from "../middlewares/validators/registerValidate";

const userRouter = Router();
const controller = new UserController();

userRouter.get("/login", loginValidate, controller.login);
userRouter.get("/:id", controller.getUserByID);
userRouter.get("/", controller.getAllUsers);
userRouter.post("/", registerValidate, controller.createUser);

export default userRouter;
