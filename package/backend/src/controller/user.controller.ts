import { UserService } from "../service/user.service";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
  public async registerUser(req: Request, res: Response) {
    try {
      const user = req.body;
      const { statusCode, response } = await userService.register(user);
      res.status(statusCode).json(response);
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const { statusCode, response } = await userService.getAllUsers();
      res.status(statusCode).json(response);
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  }

  public async getUserByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statusCode, response } = await userService.getUserByID(id);
      res.status(statusCode).json(response);
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const { statusCode, response } = await userService.login(email, password);
      res.status(statusCode).json(response);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  public async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const { statusCode, response } = await userService.forgetPassword(email);
      return res.status(statusCode).json(response);
    } catch (err: any) {
      return res.status(500).send(err);
    }
  }

  public async changePassword(req: Request, res: Response) {
    const { password } = req.body;
    const { id } = req.params;
    const { token } = req;
    try {
      const { statusCode, response } = await userService.changePassword(id, password, token);
      return res.status(statusCode).json(response);
    } catch (err: any) {
      return res.status(500).send(err);
    }
  }
}
