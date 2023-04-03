import { Role } from '../db/models/role.model';
import ResponseParse,{ ResponseParsed } from '../utils/responseParse';
import sequelize from '../db/config/db.config';
import { Repository } from 'sequelize-typescript';


export class RoleService {

    private readonly roleRepo:Repository<Role> 
    
    constructor(){
        this.roleRepo = sequelize.getRepository(Role);
    }
    
    public async getRoleByName(name: string): Promise<ResponseParsed> {
        try {
            const existsRole = await this.roleRepo.findOne({ where: { name } });
            if (!existsRole) {
                return ResponseParse(404, "Role not found");
            }
            return ResponseParse(200, existsRole);
        } catch (err: any) {
            return ResponseParse(500, err);
        }
        
        
       
    }

    public async getRoleByID(id: string): Promise<ResponseParsed> {
        try {
            const existsRole = await this.roleRepo.findOne({ where: { id } });
            if (!existsRole) {
                return ResponseParse(404, "Role not found");
            }
            return ResponseParse(200, existsRole);
        } catch (err: any) {
            return ResponseParse(500, err);
        }

    }


    public async getAllRoles(): Promise<ResponseParsed> {
        try {
            const roles = await this.roleRepo.findAll();
            if (roles.length < 1) {
                return ResponseParse(500, "There isn't any role");
            }
            return ResponseParse(200, roles);
        } catch (err: any) {
            return ResponseParse(500, err);
        }
    }


    public async createRole(role: Role): Promise<ResponseParsed> {
        try {
            const existsRole = await this.roleRepo.findOne({ where: { name: role.name } });
            if (existsRole) {
                return ResponseParse(400, "Role already exists");
            }
            const newRole = await this.roleRepo.create(role);
            return ResponseParse(201, newRole);
        } catch (err: any) {
            return ResponseParse(500, err);
        }
    }


    public async updateRole(id: string, role: Role): Promise<ResponseParsed> {
        try {
            const existsRole = await this.roleRepo.findOne({ where: { id } });
            if (!existsRole) {
                return ResponseParse(404, "Role not found");
            }
            await this.roleRepo.update(role, { where: { id } });
            return ResponseParse(200, "Role updated");
        } catch (err: any) {
            return ResponseParse(500, err);
        }
    }


    public async deleteRole(id: string): Promise<ResponseParsed> {
        try {
            const existsRole = await this.roleRepo.findOne({ where: { id } });
            if (!existsRole) {
                return ResponseParse(404, "Role not found");
            }
            await this.roleRepo.destroy({ where: { id } });
            return ResponseParse(200, "Role deleted");
        } catch (err: any) {
            return ResponseParse(500, err);
        }
    }



}