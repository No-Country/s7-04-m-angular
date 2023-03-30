import { UserService } from "../service/user.service";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {

    public async createUser(req: Request, res: Response) {
        try {
            const user = req.body;
            const createdUser = await userService.createUser(user);
            res.status(201).send(createdUser);
        } catch (err: any) {
            res.status(500).send(err.message);
        }

    }
}