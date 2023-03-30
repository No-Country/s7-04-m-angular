import { Router } from 'express';
import { UserController } from '../controller/user.controller'

const userRouter = Router();
const controller = new UserController();

userRouter.get('/', (req, res) => {
    res.send('Hello World');
});

userRouter.post('/',controller.createUser);


export default userRouter;