import { Role } from "../db/models/role.model";
//import sequelize from "../db/config/db.config";
import { Repository, Sequelize } from "sequelize-typescript";
import { RoleError } from "../error/Role.error";
import { ResponseDTO } from "../dto/general/response.dto";
import { CreateRoleRequestDTO } from "../dto/role/role.create.dto";

export class RoleService {
  private readonly roleRepo: Repository<Role>;
  private readonly sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.roleRepo = sequelize.getRepository(Role);
    this.sequelize = sequelize;
  }

  public async getRoleByName(name: string): Promise<Role> {
    const existsRole = await this.roleRepo.findOne({ where: { name } });
    if (!existsRole) {
      throw new RoleError("ROLE_NOT_FOUND", "Role not found");
    }
    return existsRole;
  }

  public async getRoleByID(id: number): Promise<Role> {
    const existsRole = await this.roleRepo.findOne({ where: { id } });
    if (!existsRole) {
      throw new RoleError("ROLE_NOT_FOUND", "Role not found");
    }
    return existsRole;
  }

  public async getAllRoles(): Promise<Array<Role>> {
    const roles = await this.roleRepo.findAll();
    if (roles.length < 1) {
      throw new RoleError("NO_ROLES_FOUND", "No roles found");
    }
    return roles;
  }

  public async createRole(role: CreateRoleRequestDTO): Promise<Role> {
    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsRole = await this.roleRepo.findOne({ where: { name: role.name }, transaction: t });
      if (existsRole) {
        throw new RoleError("ROLE_ALREADY_EXISTS", "Role already exists");
      }
      const newRole = await this.roleRepo.create(role, { transaction: t });
      return newRole;
    });
    return transactionResult;
  }

  public async updateRole(id: number, role: CreateRoleRequestDTO): Promise<ResponseDTO> {

    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsRole = await this.roleRepo.findOne({ where: { id }, transaction: t });
      if (!existsRole) {
        throw new RoleError("ROLE_NOT_FOUND", "Role not found");
      }
      await this.roleRepo.update(role, { where: { id }, transaction: t });

      return new ResponseDTO("Role Updated.");
    });
    return transactionResult;

  }

  public async deleteRole(id: number): Promise<ResponseDTO> {

    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsRole = await this.roleRepo.findOne({ where: { id }, transaction: t });
      if (!existsRole) {
        throw new RoleError("ROLE_NOT_FOUND", "Role not found");
      }
      await this.roleRepo.destroy({ where: { id }, transaction: t });
      return new ResponseDTO("Role Deleted.");
    });
    return transactionResult;

  }
}
