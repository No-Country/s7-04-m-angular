import { Router } from "express";

import { UserController } from "../controller/user.controller";
import { compareIds } from "../middlewares/compareIds";
import { changePasswordValidate } from "../middlewares/validators/changePasswordValidate";
import { forgetPasswordValidate } from "../middlewares/validators/forgetPasswordValidate";
import { loginValidate } from "../middlewares/validators/loginValidate";
import { registerValidate } from "../middlewares/validators/registerValidate";
import { auth } from "../middlewares/security/auth";

const authRouter = Router();

const controller = new UserController();

authRouter.post("/login", loginValidate, controller.login.bind(controller));
authRouter.post("/register", registerValidate, controller.registerUser.bind(controller));
authRouter.post("/forgetPassword", forgetPasswordValidate, controller.forgetPassword.bind(controller));
authRouter.post("/changePassword/:id", auth, compareIds, changePasswordValidate, controller.changePassword.bind(controller));

export default authRouter;
