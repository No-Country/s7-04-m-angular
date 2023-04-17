import { Request } from "express";
import jwt from "jsonwebtoken";
import { HttpException } from "../../error/HttpException";
import { HttpStatus } from "../../utils/enum/http.status";


export function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[]
  ): Promise<any> {

    if (securityName === "jwt") {
      
  
      return new Promise((resolve, reject) => {


        const token = request.headers.authorization?.split(" ")[1]

        if (!token) {
          reject(new HttpException(HttpStatus.UNAUTHORIZED, "No token provided"));
        }
        jwt.verify(token,process.env.JWT_SECRET, function (err: any, decoded: any) {
          if (err) {
            reject(err);
          } else {
            // Check if JWT contains all required scopes
            for (let scope of scopes) { 
              if (!decoded.scope.includes(scope)) {
                reject(new HttpException(HttpStatus.FORBIDDEN, "You don't have permission to access this resource"));
              }
            }  

            request.user = decoded;
            resolve(decoded);
          }
        });
      });
    }

    

    return Promise.reject(new Error("Unknown security name"));
  }