import { Request, Response } from 'express';

import { RoleService } from '../service/role.service';
import { RoleDTO } from '../dto/role/role.dto'
import { plainToInstance } from 'class-transformer';
import { HttpStatus } from '../utils/enum/http.status';


export class RoleController {
        private readonly roleService: RoleService;

        constructor() {
                this.roleService = new RoleService();
        }

        public getRoleByID = async (req: Request, res: Response) => {
                try {
                        
                        const role = await this.roleService.getRoleByID(parseInt(req.params.id));
                        const roleDto = plainToInstance(RoleDTO, role, { excludeExtraneousValues: true });
                        res.status(200).json(roleDto);
                } catch (err: any) {
                        res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
                }
        }

        public getAllRoles = async (req: Request, res: Response) => {
                try {
                        const roles = await this.roleService.getAllRoles();
                        const rolesDto = plainToInstance(RoleDTO, roles, { excludeExtraneousValues: true });
                        res.status(200).json(rolesDto);
                } catch (err: any) {
                        res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
                }
        }

        public createRole = async (req: Request, res: Response) => {
                try {
                        const roleCreated = await this.roleService.createRole(req.body);
                        const roleDto = plainToInstance(RoleDTO, roleCreated, { excludeExtraneousValues: true });
                        res.status(201).json(roleDto);
                } catch (err: any) {
                        res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
                }
        }

        public updateRole = async (req: Request, res: Response) => {
                try {
                        const response = await this.roleService.updateRole(req.params.id, req.body);
                        res.status(200).json(response);
                } catch (err: any) {
                        res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
                }
        }

        public deleteRole = async (req: Request, res: Response) => {
                try {
                        const response = await this.roleService.deleteRole(req.params.id);
                         res.status(200).json(response);
                } catch (err: any) {
                        res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
                }
        }

}