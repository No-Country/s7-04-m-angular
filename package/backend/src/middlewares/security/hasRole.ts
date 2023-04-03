import { Request, Response, NextFunction } from 'express';

export const hasRole = (role:string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user.role === role) {
        next();
        } else {
        res.status(403).json({error: 'Forbidden', message: 'Insufficient permissions to access this resource'})
        }
    };

}
