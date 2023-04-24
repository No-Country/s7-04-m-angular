import { UserService } from "../service/user.service";
import { Request as ExpressRequest } from "express";
import sequelize from '../db/config/db.config'
import { plainToInstance } from "class-transformer";
import { RegisterUserDTO } from "../dto/user/register.user.dto";
import { UserCreatedDTO } from "../dto/user/created.user.dto";
import { HttpStatus } from "../utils/enum/http.status";
import { LoginUserDTO } from "../dto/user/login.request.dto";
import { Controller, Route, Post, Body, Path, Tags,Get, Request, Security } from 'tsoa'
import { LoginResponseDTO } from "../dto/user/login.response.dto";
import { ResponseDTO } from "../dto/general/response.dto";
import { UpdateUserDTO } from "../dto/user/update.user.dto";
import { validateOrReject } from "class-validator";
import { ForgetPassDTO } from "../dto/user/forgetpass.dto";
import { ChangePassDTO } from "../dto/user/changepass.dto";
import { UserDTO } from "../dto/user/user.dto";



@Tags('Auth')
@Route('api/v1/')
export class AuthController extends Controller {

    private readonly userService: UserService;

    constructor() {
        super();
        this.userService = new UserService(sequelize);
    }

    @Post('register')
    public async registerUser(@Body() body:RegisterUserDTO): Promise<UserCreatedDTO> {

        
        const userDTO = plainToInstance(RegisterUserDTO, body, { excludeExtraneousValues: true });
        //Valido el body
        await validateOrReject(userDTO, { validationError: { target: false } });

        const usrCreated = await this.userService.register(userDTO);
        //Mapeo User a UserCreatedDTO
        const userCreatedDTO = plainToInstance(UserCreatedDTO, usrCreated, { excludeExtraneousValues: true });
        return userCreatedDTO;
    }


    @Post('login')
    public async login(@Body() body: LoginUserDTO): Promise<LoginResponseDTO> {
        const loginUsrDto = plainToInstance(LoginUserDTO, body, { excludeExtraneousValues: true });
        //Valido el body
        await validateOrReject(loginUsrDto, { validationError: { target: false } });
        const loginResponse = await this.userService.login(loginUsrDto.email, loginUsrDto.password);
        return loginResponse;
    }


    @Post('forgetPassword')
    public async forgetPassword(@Body() body: ForgetPassDTO): Promise<ResponseDTO> {
        const forgetPassDto = plainToInstance(ForgetPassDTO, body, { excludeExtraneousValues: true });
        //Valido el body
        await validateOrReject(forgetPassDto, { validationError: { target: false } });
        const response = await this.userService.forgetPassword(body.email);
        return response;

    }

    @Post('changePassword/:id')
    public async changePassword(@Body() body: ChangePassDTO, @Path() id: number): Promise<ResponseDTO> {
        const dto = plainToInstance(ChangePassDTO, body, { excludeExtraneousValues: true });
        //Valido el body
        await validateOrReject(dto, { validationError: { target: false } });
        const response = await this.userService.changePassword(id, dto.password, dto.token);
        return response;
    }


    @Security('jwt')
    @Get('/auth/me')
    public async getMe(@Request() request: ExpressRequest): Promise<UserDTO> {
        const { sub } = request.user;
        const user = await this.userService.getMe(sub);
        //Mapeo User a UserDTO
        const userDTO = plainToInstance(UserDTO, user, { excludeExtraneousValues: true });
        this.setStatus(HttpStatus.OK)
        return userDTO;
    }

}
