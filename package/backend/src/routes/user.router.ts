import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { validateToken } from "../middlewares/validateToken";
import { loginValidate } from "../middlewares/validators/loginValidate";
import { registerValidate } from "../middlewares/validators/registerValidate";
import { forgetPasswordValidate } from "../middlewares/validators/forgetPasswordValidate";
import { changePasswordValidate } from "../middlewares/validators/changePasswordValidate";
import { compareIds } from "../middlewares/compareIds";

const userRouter = Router();
const controller = new UserController();

userRouter.get("/login", loginValidate, controller.login);
userRouter.get("/:id", controller.getUserByID);
userRouter.get("/", controller.getAllUsers);
userRouter.post("/forgetPassword", forgetPasswordValidate, controller.forgetPassword);
userRouter.post("/changePassword/:id", validateToken, compareIds, changePasswordValidate, controller.changePassword);
userRouter.post("/", registerValidate, controller.createUser);

export default userRouter;
