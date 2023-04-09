import { UserService } from "../service/user.service";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { RegisterUserDTO } from "../dto/user/register.user.dto";
import { UserCreatedDTO } from "../dto/user/created.user.dto";
import { HttpStatus } from "../utils/enum/http.status";
import { UserDTO } from "../dto/user/user.dto";
import { UsersPaginatedDTO } from "../dto/user/users.paginated.dto";
import { LoginUserDTO } from "../dto/user/login.request.dto";


//const userService = new UserService();
type getAllQuery = {
  limit?: number;
  page?: number;
};


export class UserController {

   private readonly userService: UserService;

  constructor(){
    this.userService = new UserService();
  }

 
  public async registerUser(req: Request, res: Response) {
    try {
      //Mapeo el body de la request en una instancia de RegisterUserDTO
      const userDTO = plainToInstance(RegisterUserDTO, req.body, { excludeExtraneousValues: true }); 
      const usrCreated = await this.userService.register(userDTO);
      //Mapeo User a UserCreatedDTO
      const userCreatedDTO = plainToInstance(UserCreatedDTO, usrCreated, { excludeExtraneousValues: true });
      res.status(HttpStatus.CREATED).json(userCreatedDTO);
    } catch (err: any) {
      res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try { 
      const query = req.query as getAllQuery;
      const users = await this.userService.getAllUsers(query.page,query.limit);
      //Mapeo Users a UsersPaginatedDTO
      const usersPaginatedDTO = plainToInstance(UsersPaginatedDTO, users, { excludeExtraneousValues: true });
      res.status(HttpStatus.OK).json(usersPaginatedDTO);
    } catch (err: any) {
      res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
  }

  public async getUserByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserByID(id);
      //Mapeo User a UserDTO
      const userDTO = plainToInstance(UserDTO, user, { excludeExtraneousValues: true });
      res.status(HttpStatus.OK).json(userDTO);
    } catch (err: any) {
      res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
  }

  public async login(req: Request, res: Response) {

    try {
      const { email, password } = plainToInstance(LoginUserDTO, req.body, { excludeExtraneousValues: true });
      const loginResponse = await this.userService.login(email, password);
      res.status(HttpStatus.OK).json(loginResponse);
    } catch (err: any) {
      res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
  }

  public async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const { statusCode, response } = await this.userService.forgetPassword(email);
      res.status(statusCode).json(response);
    } catch (err: any) {
      res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
  }

  public async changePassword(req: Request, res: Response) {
    const { password } = req.body;
    const { id } = req.params;
    const { token } = req;
    try {
      const { statusCode, response } = await this.userService.changePassword(id, password, token);
      res.status(statusCode).json(response);
    } catch (err: any) {
      res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
  }
}
