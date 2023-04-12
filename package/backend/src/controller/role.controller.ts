import sequelize from '../db/config/db.config'

import { RoleService } from '../service/role.service';
import { RoleDTO } from '../dto/role/role.dto'
import { plainToInstance } from 'class-transformer';
import { HttpStatus } from '../utils/enum/http.status';
import { CreateRoleRequestDTO } from '../dto/role/role.create.dto';


import { Body, Controller, Get, Path, Post, Put, Tags, Route, SuccessResponse, Delete, Response, Security} from 'tsoa';
import { ResponseDTO } from '../dto/general/response.dto';

import { IValidateErrorJSON } from '../interfaces/IValidateErrorJSON';


@Tags("Role")
@Route('api/v1/roles')
@Security('jwt', ['admin'])
export class RoleController extends Controller {

        private readonly roleService: RoleService;

        constructor() {
                super();
                this.roleService = new RoleService(sequelize);
        }


        @Get('{id}')
        public async getRoleByID(@Path() id: number): Promise<RoleDTO> {
                const role = await this.roleService.getRoleByID(id);
                const roleDto = plainToInstance(RoleDTO, role, { excludeExtraneousValues: true });
                this.setStatus(HttpStatus.OK)
                return roleDto;

        }
        
        @Response<IValidateErrorJSON>(422, "Validation Failed")
        @Get()
        public async getAllRoles(): Promise<RoleDTO[]> {
                const roles = await this.roleService.getAllRoles();
                const rolesDto = plainToInstance(RoleDTO, roles, { excludeExtraneousValues: true });
                this.setStatus(HttpStatus.OK)
                return rolesDto;
        }

        @Response<IValidateErrorJSON>(422, "Validation Failed")
        @Post()
        public async createRole(@Body() body: CreateRoleRequestDTO): Promise<RoleDTO> {
                const createRoleDto = plainToInstance(CreateRoleRequestDTO, body, { excludeExtraneousValues: true });
                const roleCreated = await this.roleService.createRole(createRoleDto);
                const roleDto = plainToInstance(RoleDTO, roleCreated, { excludeExtraneousValues: true });
                this.setStatus(HttpStatus.CREATED)
                return roleDto;

        }


        @Response<IValidateErrorJSON>(422, "Validation Failed")
        @Put('{id}')
        public async updateRole(@Path() id: number, @Body() body: CreateRoleRequestDTO): Promise<ResponseDTO> {

                const updateRoleDto = plainToInstance(CreateRoleRequestDTO, body, { excludeExtraneousValues: true });
                const response = await this.roleService.updateRole(id, updateRoleDto);
                this.setStatus(HttpStatus.OK)
                return response;

        }


        @Response<IValidateErrorJSON>(422, "Validation Failed")
        @SuccessResponse('200', 'Role Deleted')
        @Delete('{id}')
        public async deleteRole(@Path() id: number): Promise<ResponseDTO> {
                const response = await this.roleService.deleteRole(id);
                this.setStatus(HttpStatus.OK)
                return response;
        }

}