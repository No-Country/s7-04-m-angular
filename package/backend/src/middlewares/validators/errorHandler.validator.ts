import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
export const errorHandler = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()){ next() }
    else res.status(400).json({ errors: errors.array() })
}