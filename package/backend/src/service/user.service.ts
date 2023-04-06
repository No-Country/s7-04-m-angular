import { User } from "../db/models/user.model";
import sequelize from "../db/config/db.config";
import { hashPassword } from "../utils/hashPassword";
import { comparePasswords } from "../utils/comparePasswords";
import ResponseParse, { ResponseParsed } from "../utils/responseParse";
import { Role } from "../db/models/role.model";
import JWTService from "./jwt.service";
import { Repository } from "sequelize-typescript";
import { sendMail } from "../utils/sendMail";
import { RegisterUserDTO } from "../dto/user/register.user.dto";
import { UserError } from "../error/User.error";
import { LoginResponseDTO } from "../dto/user/login.response.dto";
import Paginator from "../utils/paginator";
import { IPaginated } from "../interfaces/IPaginated";

export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly roleRepository: Repository<Role>;
  private readonly jwtService: JWTService;
  private readonly paginator: Paginator<User>;

  constructor() {
    this.jwtService = new JWTService();
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
  public async getUserByID(id: string): Promise<User> {
      const existsUser = await this.userRepository.findOne({ where: { id }});
      if (!existsUser) {
        throw new UserError("USER_NOT_FOUND", "User not found");
      }
      return existsUser;
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

      // create jwt
      const token = this.jwtService.sign({ id: existsUser.id, role: existsUser.role.name });

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
    const existsUser = await this.userRepository.findOne({ where: { email: user.email } });
    if (existsUser) {
      throw new UserError("USER_ALREADY_EXISTS", "User already exists");
    }
    const hPassword = await hashPassword(user.password);
    const data = { ...user, password: hPassword, roleId: 1, isValid: true };
    const newUser = await this.userRepository.create(data);

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

  }

  
  public async forgetPassword(email: string): Promise<ResponseParsed> {
    try {
      const existsUser = await this.userRepository.findOne({
        where: { email },
        include: [this.roleRepository],
      });
      if (!existsUser) {
        return ResponseParse(400, "User not found");
      }
      const token = this.jwtService.sign({ id: existsUser.id, role: existsUser.role.name }, "15m");
      await this.userRepository.update(
        { token },
        {
          where: {
            id: existsUser.id,
          },
        }
      );

      const url: string = `${process.env.FRONT_URL || "http://localhost:5173"}/changePassword/${existsUser.id}/${token}`;

      const subject: string = "Change Password";
      const message: string = `
      <div>
      <p>Change password</p>
      <a href=${url}>Change</a>
      </div>`;
      await sendMail(existsUser.email, subject, message);

      return ResponseParse(200, "Email sending");
    } catch (err: any) {
      return ResponseParse(500, err.message);
    }
  }

  public async changePassword(id: string, password: string, token: string) {
    try {
      const existsUser = await this.userRepository.findOne({ where: { id } });
      // check if user exists
      if (!existsUser) {
        return ResponseParse(404, "User not found");
      }

      // compare tokens
      if (token !== existsUser.token) {
        return ResponseParse(401, "Invalid user token");
      }

      const hPassword = await hashPassword(password);
      await this.userRepository.update(
        { token: "", password: hPassword },
        {
          where: {
            id,
          },
        }
      );

      return ResponseParse(200, "Password changed");
    } catch (err: any) {
      return ResponseParse(500, err.message);
    }
  }



  public async updateUser(id: string, user: User): Promise<Object> {
    const existsUser = await this.userRepository.findOne({ where: { id } });
    if (!existsUser) {
      throw new UserError("USER_NOT_FOUND", "User not found");
    }
    const updatedUser = await this.userRepository.update(user, { where: { id } });
    return updatedUser;
  }



  public async deleteUser(id: string): Promise<Object> {
    const existsUser = await this.userRepository.findOne({ where: { id } });
    if (!existsUser) {
      throw new UserError("USER_NOT_FOUND", "User not found");
    }
    const deletedUser = await this.userRepository.destroy({ where: { id } });
    return deletedUser;
  }

  

}
