import { Router } from 'express';

import { UserController } from '../controller/user.controller';
import { loginValidate } from "../middlewares/validators/loginValidate";
import { registerValidate } from "../middlewares/validators/registerValidate";

const authRouter = Router();

const controller = new UserController();

authRouter.post('/login', loginValidate, controller.login);
authRouter.post("/register", registerValidate, controller.registerUser);

export default authRouter;