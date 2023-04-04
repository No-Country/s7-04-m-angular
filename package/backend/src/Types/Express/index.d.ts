import { Request } from "express";
import { UserRequest } from "../userRequest";
export {};

declare global {
  namespace Express {
    export interface Request {
      user: UserRequest;
      token: string;
    }
  }
}
