import jwt from "jsonwebtoken";
import { UserRequest } from "../Types/userRequest";

export default class JWTService {
  private readonly secret: any;
  private readonly expiresIn: any;

  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.expiresIn = process.env.JWT_EXPIRATION;
  }

  public sign(payload: UserRequest): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  public verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
