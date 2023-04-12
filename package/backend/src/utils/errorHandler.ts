import { Response as ExResponse, Request as ExRequest, NextFunction, } from "express";
import { ValidateError } from "tsoa";
import { ErrorBase } from "../error/ErrorBase";


import { HttpStatus } from './enum/http.status';
import { ValidationError } from "class-validator";

export default function errorHandler(
    err: any,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof ErrorBase) {
        console.warn(`Caught Error for ${req.path}:`, err.message);
        return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }

    if (err instanceof Array) {
        console.warn(`Caught Validation Error for ${req.path}:`);
        return res.status(400).json({
            message: "Validation Failed",
            details: err
        });
    }
  
    console.warn(`Caught Error for ${req.path}:`, err.message);
        return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || "Internal Server Error",
        });
    
    next();
}