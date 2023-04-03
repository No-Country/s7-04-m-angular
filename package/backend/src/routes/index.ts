import { Router } from 'express';
import userRouter from './user.router';
import authRouter from './auth.router';
import roleRouter from './role.router';


const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use(authRouter);
router.use('/users', userRouter);
router.use('/roles',roleRouter);

export default router;


