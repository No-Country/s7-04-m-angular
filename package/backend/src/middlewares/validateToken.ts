import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { IPayload } from "../interfaces/IPayload";

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).send("Token is missing");
      }
      const payload = jwt.verify(token, `${process.env.JWT_SECRET || ""}`) as IPayload;
      req.id = payload.id.toString();
      req.role = payload.role;
      req.token = token;

      return next();
    } catch (error) {
      console.log(error.message);
      return res.status(404).json({
        ok: false,
        msg: error.message === "invalid signature" ? "Invalid token" : "Expired token",
      });
    }
  }
  return res.status(401).send("Not authorized header");
};
