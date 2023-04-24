import { UserService } from "../service/user.service";
import sequelize from '../db/config/db.config'
import { plainToInstance } from "class-transformer";
import { UserCreatedDTO } from "../dto/user/created.user.dto";
import { HttpStatus } from "../utils/enum/http.status";
import { UserDTO } from "../dto/user/user.dto";
import { UsersPaginatedDTO } from "../dto/user/users.paginated.dto";
import { UpdateUserDTO } from "../dto/user/update.user.dto";
import { CreateUserDTO } from "../dto/user/create.user.dto";
import { ResponseDTO } from "../dto/general/response.dto";
import { Body, Controller, Get, Path, Post, Put, Query, Route, SuccessResponse, Delete, Response, Security, Tags } from 'tsoa';
import { validateOrReject } from "class-validator";



@Tags('User')
@Route('api/v1/users')
@Security('jwt', ['admin'])
export class UserController extends Controller {

  private readonly userService: UserService;

  constructor() {
    super();
    this.userService = new UserService(sequelize);
  }


  @Post()
  @SuccessResponse('201', 'Created')
  public async createUser(@Body() body: CreateUserDTO): Promise<UserCreatedDTO> {
   
    //Mapeo el body de la request en una instancia de CreateUserDTO
    const userDTO = plainToInstance(CreateUserDTO, body, { excludeExtraneousValues: true });
    //Valido el body
    await validateOrReject(userDTO, { validationError: { target: false } });
    
    const usrCreated = await this.userService.createUser(userDTO);
    //Mapeo User a UserDTO
    const userCreatedDTO = plainToInstance(UserCreatedDTO, usrCreated, { excludeExtraneousValues: true });
    this.setStatus(HttpStatus.CREATED);
    return userCreatedDTO;

  }


  @Get()
  @SuccessResponse('200', 'OK')
  public async getAllUsers(@Query() page?: number, @Query() limit?: number ): Promise<UsersPaginatedDTO> {
    const users = await this.userService.getAllUsers(page, limit);
    //Mapeo Users a UsersPaginatedDTO
    const usersPaginatedDTO = plainToInstance(UsersPaginatedDTO, users, { excludeExtraneousValues: true });
    this.setStatus(HttpStatus.OK);
    return usersPaginatedDTO;
  }



  @Get('{id}')
  @SuccessResponse('200', 'OK')
  public async getUserByID(@Path() id: number): Promise<UserDTO> {
    const user = await this.userService.getUserByID(id);
    //Mapeo User a UserDTO
    const userDTO = plainToInstance(UserDTO, user, { excludeExtraneousValues: true });
    this.setStatus(HttpStatus.OK)
    return userDTO;
  }


  @Delete('{id}')
  @SuccessResponse('200', 'OK')
  public async deleteUser(@Path() id: number): Promise<ResponseDTO> {
    const response = await this.userService.deleteUser(id);
    this.setStatus(HttpStatus.OK)
    return response;
  }

  @Put('{id}')
  @SuccessResponse('200', 'OK')
  public async updateUser(@Path() id: number, @Body() body: UpdateUserDTO): Promise<ResponseDTO> {

    const updateUserDto = plainToInstance(UpdateUserDTO, body, { excludeExtraneousValues: true });
    //Valido el body
    await validateOrReject(updateUserDto, { validationError: { target: false } });
    const response = await this.userService.updateUser(id, updateUserDto);
    this.setStatus(HttpStatus.OK)
    return response;

  }





}
