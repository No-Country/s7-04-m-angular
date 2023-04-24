import { Request } from "express";
import { IUserRequest } from "../IUserRequest";
export {};

declare global {
  namespace Express {
    export interface Request {
      user: IUserRequest;
      token: string;
    }
  }
}
