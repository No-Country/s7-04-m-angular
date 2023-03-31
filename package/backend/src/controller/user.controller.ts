import { UserService } from "../service/user.service";
import { Request, Response } from "express";
import { jwtGenerate } from "../utils/jwtGenerate";
import { comparePasswords } from "../utils/comparePasswords";

const userService = new UserService();

export class UserController {
  public async createUser(req: Request, res: Response) {
    try {
      const user = req.body;
      const createdUser = await userService.createUser(user);
      return res.status(201).send(createdUser);
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const allUsers = await userService.getAllUsers();
      if (allUsers.length < 1) {
        return res.status(404).json({ msg: "There isn't any user" });
      }
      return res.status(200).json({ users: allUsers });
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  }

  public async getUserByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const existsUser = await userService.getUser({ id });
      if (!existsUser) {
        return res.status(404).json({ msg: "User don't found" });
      }
      return res.status(200).json({ user: existsUser });
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const existsUser = await userService.getUser({ email });
      if (!existsUser) {
        return res.status(404).json({ msg: "User don't found" });
      }

      // compare passwords
      const validPassword = await comparePasswords(password, existsUser.password);
      if (!validPassword) {
        return res.status(403).json({
          msg: "Passwords are different",
        });
      }

      // create jwt
      const token = jwtGenerate(existsUser.id, "user", "1d");

      const user = {
        id: existsUser.id,
        token,
      };

      return res.status(200).json({ user: user });
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  }
}
