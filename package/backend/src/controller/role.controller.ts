import {Request, Response} from 'express';

import { RoleService } from '../service/role.service';

export class RoleController {
    private readonly roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    public getRoleByID = async (req: Request, res: Response) => { 
            const {response,statusCode} = await this.roleService.getRoleByID(req.params.id);
            return res.status(statusCode).json(response);             
    }

    public getAllRoles = async (req: Request, res: Response) => {
            const {response,statusCode} = await this.roleService.getAllRoles();
            return res.status(statusCode).json(response);    
    }

    public createRole = async (req: Request, res: Response) => {
            const {response,statusCode} = await this.roleService.createRole(req.body);
            return res.status(statusCode).json(response);    
    }

    public updateRole = async (req: Request, res: Response) => {
            const {response,statusCode} = await this.roleService.updateRole(req.params.id,req.body);
            return res.status(statusCode).json(response);    
    }

    public deleteRole = async (req: Request, res: Response) => {
            const {response,statusCode} = await this.roleService.deleteRole(req.params.id);
            return res.status(statusCode).json(response);    
    }
    
}