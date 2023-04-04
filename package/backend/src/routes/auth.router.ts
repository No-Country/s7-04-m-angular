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

authRouter.post("/login", loginValidate, controller.login);
authRouter.post("/register", registerValidate, controller.registerUser);
authRouter.post("/forgetPassword", forgetPasswordValidate, controller.forgetPassword);
authRouter.post("/changePassword/:id", auth, compareIds, changePasswordValidate, controller.changePassword);

export default authRouter;
