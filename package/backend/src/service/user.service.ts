import { User } from "../db/models/user.model";
//import sequelize from "../db/config/db.config";
import { hashPassword } from "../utils/hashPassword";
import { comparePasswords } from "../utils/comparePasswords";
import ResponseParse, { ResponseParsed } from "../utils/responseParse";
import { Role } from "../db/models/role.model";
import JWTService from "./jwt.service";
import { Repository, Sequelize } from "sequelize-typescript";
import { sendMail } from "../utils/sendMail";
import { RegisterUserDTO } from "../dto/user/register.user.dto";
import { UserError } from "../error/User.error";
import { LoginResponseDTO } from "../dto/user/login.response.dto";
import Paginator from "../utils/paginator";
import { IPaginated } from "../interfaces/IPaginated";
import { ResponseDTO } from "../dto/general/response.dto";
import { UpdateUserDTO } from "../dto/user/update.user.dto";
import { Op } from "sequelize";
import { CreateUserDTO } from "../dto/user/create.user.dto";
import { UpdateMeDTO } from "../dto/user/updateMe.dto";

export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly roleRepository: Repository<Role>;
  private readonly jwtService: JWTService;
  private readonly paginator: Paginator<User>;
  private readonly sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.jwtService = new JWTService();
    this.sequelize = sequelize;
    this.userRepository = sequelize.getRepository(User);
    this.roleRepository = sequelize.getRepository(Role);
    this.paginator = new Paginator(this.userRepository);
  }

  /**
   * Get all users
   * @param page 
   * @param limit 
   * @returns Promise<IPaginated<User>>
   */
  public async getAllUsers(page = 1, limit = 10): Promise<IPaginated<User>> {
    const users = await this.paginator.paginate({ where: { isValid: true } }, page, limit);
    return users;
  }

  /**
   * Get user by id
   * @param id 
   * @returns Promise<User>
   */
  public async getUserByID(id: number): Promise<User> {
    const existsUser = await this.userRepository.findOne({ where: { id } });
    if (!existsUser) {
      throw new UserError("USER_NOT_FOUND", "User not found");
    }
    return existsUser;
  }

  /**
   * Get user by email
   * @param email 
   * @returns 
   */
  public async getUserByEmail(email: string): Promise<User> {
    const existsUser = await this.userRepository.findOne({ where: { email } });
    if (!existsUser) {
      throw new UserError("USER_NOT_FOUND", "User not found");
    }
    return existsUser;
  }




  public async createUser(user: CreateUserDTO): Promise<User> {
    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsUser = await this.userRepository.findOne({ where: { email: user.email }, transaction: t });
      if (existsUser) {
        throw new UserError("USER_ALREADY_EXISTS", "User already exists");
      }

      user.password = await hashPassword(user.password);
      const newUser = await this.userRepository.create(user, { transaction: t });
      return newUser;

    });
    return transactionResult;
  }





  

  public async getMe(id: number): Promise<User> {
    const existsUser = await this.userRepository.findOne({ where: { id }, include: [this.roleRepository] });
    if (!existsUser) {
      throw new UserError("USER_NOT_FOUND", "User not found");
    }
    return existsUser;
  }



  public async updateMe(id: number, user: UpdateMeDTO): Promise<User> {

    const transactionResult = await this.sequelize.transaction(async (t) => {

      const existsUser = await this.userRepository.findOne({ where: { id }, transaction: t });
      if (!existsUser) {
        throw new UserError("USER_NOT_FOUND", "User not found");
      }

      if(user.password){
        user.password = await hashPassword(user.password);
      }

      const updatedUser = await existsUser.update(user, { transaction: t });

      return updatedUser;

    });
    return transactionResult;
  }



  /**
   * Perform login
   * @param email 
   * @param password 
   * @throws UserError
   * @returns Promise<LoginResponseDTO>
   */
  public async login(email: string, password: string): Promise<LoginResponseDTO> {

    const existsUser = await this.userRepository.findOne({
      where: { email },
      include: [this.roleRepository],
    });
    if (!existsUser) {
      throw new UserError("USER_NOT_FOUND", "User not found");
    }

    // compare passwords
    const validPassword = await comparePasswords(password, existsUser.password);
    if (!validPassword) {
      throw new UserError("USER_PASSWORD_INCORRECT", "Invalid password");
    }

    //validate if user is valid / active
    if (!existsUser.isValid) {
      throw new UserError("USER_NOT_ACTIVATED", "User is not active, please contact with the administrator.");
    }

    // create jwt
    const token = this.jwtService.sign({ sub: existsUser.id, scope: Array(existsUser.role.name) });

    return new LoginResponseDTO(existsUser.id, token);

  }

  /**
   * Creates a new user in the database (coming from the register form)
   * @param user
   * @throws UserError
   * @returns Promise<User>
   * @todo Send email to validate account
   * @todo Validate account
   * */
  public async register(user: RegisterUserDTO): Promise<User> {

    const transactionResult = await this.sequelize.transaction(async (t) => {

      const existsUser = await this.userRepository.findOne({ where: { [Op.or]: [{ email: user.email }, { nickname: user.nickname }] }, paranoid: false, transaction: t });
      if (existsUser) {
        throw new UserError("USER_ALREADY_EXISTS", "The email or nickname already exists");
      }
      const hPassword = await hashPassword(user.password);
      const data = { ...user, password: hPassword, roleId: 1, isValid: true };
      const newUser = await this.userRepository.create(data, { transaction: t });

      /* //Validar cuenta
        const token = this.jwtService.sign({ id: newUser.id, role: "user" });
        await this.userRepository.update({ token }, { where: { id: newUser.id } });
        const url: string = `${process.env.FRONT_URL || "http://localhost:5173"}/validateAccount/${newUser.id}/${token}`;
        const subject: string = "Activate Account";
        const message: string = `
        <div>
        <p>Active account</p>
        <a href=${url}>Validate</a>
        </div>`;
        await sendMail(user.email, subject, message);*/
      return newUser;
    });

    return transactionResult;

  }


  public async forgetPassword(email: string): Promise<ResponseDTO> {
    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsUser = await this.userRepository.findOne({
        where: { email },
        include: [this.roleRepository],
        transaction: t
      });
      if (!existsUser) {
        throw new UserError("USER_NOT_FOUND", "User not found");
      }
      const token = this.jwtService.sign({ sub: existsUser.id, scope: Array(existsUser.role.name) }, "15m");
      await this.userRepository.update(
        { token },
        {
          where: {
            id: existsUser.id,
          },
          transaction: t
        }
      );
      /** 
            const url: string = `${process.env.FRONT_URL || "http://localhost:5173"}/changePassword/${existsUser.id}/${token}`;
      
            const subject: string = "Change Password";
            const message: string = `
            <div>
            <p>Change password</p>
            <a href=${url}>Change</a>
            </div>`;
            await sendMail(existsUser.email, subject, message);*/
      return new ResponseDTO("Email sent.");
    });
    return transactionResult;

  }
  public async changePassword(id: number, password: string, token: string): Promise<ResponseDTO> {

    const transactionResult = await this.sequelize.transaction(async (t) => {

      const existsUser = await this.userRepository.findOne({ where: { id }, transaction: t });
      // check if user exists
      if (!existsUser) {
        throw new UserError("USER_NOT_FOUND", "User not found");
      }

      // compare tokens
      if (token !== existsUser.token) {
        throw new UserError("RECOVERY_TOKEN_INCORRECT", "Invalid recovery token");
      }
      const hPassword = await hashPassword(password);
      await this.userRepository.update(
        { token: "", password: hPassword },
        {
          where: {
            id,
          },
          transaction: t
        }
      );
      return new ResponseDTO("Password changed");
    });
    return transactionResult;
  }



  public async updateUser(id: number, user: UpdateUserDTO): Promise<ResponseDTO> {
    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsUser = await this.userRepository.findOne({ where: { id }, transaction: t });
      if (!existsUser) {
        throw new UserError("USER_NOT_FOUND", "User not found");
      }

      if (user.password && (user.password != existsUser.password)) {
        const hPassword = await hashPassword(user.password);
        const data = { ...user, password: hPassword };
        await this.userRepository.update(data, { where: { id }, transaction: t });
      } else {
        await this.userRepository.update(user, { where: { id }, transaction: t });
      }

      return new ResponseDTO("User updated");
    });
    return transactionResult;
  }



  public async deleteUser(id: number): Promise<ResponseDTO> {
    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsUser = await this.userRepository.findOne({ where: { id }, transaction: t });
      if (!existsUser) {
        throw new UserError("USER_NOT_FOUND", "User not found");
      }
      await this.userRepository.destroy({ where: { id }, transaction: t });
      return new ResponseDTO("User deleted");
    });
    return transactionResult;
  }


  public async restoreUserbyId(id: number): Promise<ResponseDTO> {
    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsUser = await this.userRepository.findOne({ where: { id }, paranoid: false, transaction: t },);
      if (!existsUser) {
        throw new UserError("USER_NOT_FOUND", "User not found");
      }
      await this.userRepository.update({ deletedAt: null }, { where: { id }, transaction: t });
      return new ResponseDTO("User restored");
    });
    return transactionResult;
  }

  public async restoreUserbyEmail(email: string): Promise<ResponseDTO> {
    const transactionResult = await this.sequelize.transaction(async (t) => {
      const existsUser = await this.userRepository.findOne({ where: { email }, paranoid: false, transaction: t },);
      if (!existsUser) {
        throw new UserError("USER_NOT_FOUND", "User not found");
      }
      await this.userRepository.update({ deletedAt: null }, { where: { email }, transaction: t });
      return new ResponseDTO("User restored");
    });
    return transactionResult;
  }


}
