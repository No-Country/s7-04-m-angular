import { UserService } from "../service/user.service";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
  public async createUser(req: Request, res: Response) {
    try {
      const user = req.body;
      const { statusCode, response } = await userService.register(user);
      return res.status(statusCode).json(response);
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const { statusCode, response } = await userService.getAllUsers();
      return res.status(statusCode).json(response);
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  }

  public async getUserByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statusCode, response } = await userService.getUserByID(id);
      return res.status(statusCode).json(response);
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const { statusCode, response } = await userService.login(email, password);
      return res.status(statusCode).json(response);
    } catch (err: any) {
      return res.status(500).send(err);
    }
  }
}
