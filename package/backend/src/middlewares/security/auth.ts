import { Request, Response, NextFunction } from 'express';
import JWTService from '../../service/jwt.service';
const jwtService = new JWTService();

export const auth = async (req: Request, res: Response, next: NextFunction) => {


    try {
        if (req.headers.authorization) {

            const normalizedToken = req.headers.authorization.split(' ')[1];
            const decodedToken = jwtService.verify(normalizedToken);
            req.user = decodedToken;
            return next();

        } else {
            return res.status(401).json({ message: 'Unauthorized', error: new Error('No token provided') });
        }

    } catch (err: any) {
        return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }


}