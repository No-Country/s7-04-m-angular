import { User } from "../db/models/user.model";
import sequelize from "../db/config/db.config";
import { hashPassword } from "../utils/hashPassword";
import { comparePasswords } from "../utils/comparePasswords";
import ResponseParse, { ResponseParsed } from "../utils/responseParse";
import { Role } from "../db/models/role.model";
import JWTService from "./jwt.service";
import { Repository } from "sequelize-typescript";
import { sendMail } from "../utils/sendMail";

export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly roleRepository: Repository<Role>;
  private readonly jwtService: JWTService;

  constructor() {
    this.jwtService = new JWTService();
    this.userRepository = sequelize.getRepository(User);
    this.roleRepository = sequelize.getRepository(Role);
  }

  public async getAllUsers(): Promise<ResponseParsed> {
    try {
      const users = await this.userRepository.findAll({ attributes: ["nickname", "email"], where: { isValid: true } });
      if (users.length < 1) {
        return ResponseParse(500, "There isn't any user");
      }
      return ResponseParse(200, users);
    } catch (err: any) {
      return ResponseParse(500, err.message);
    }
  }

  public async getUserByID(id: string): Promise<ResponseParsed> {
    try {
      const existsUser = await this.userRepository.findOne({ where: { id }, attributes: ["nickname", "email"] });
      if (!existsUser) {
        return ResponseParse(404, "User not found");
      }
      return ResponseParse(200, existsUser);
    } catch (err: any) {
      return ResponseParse(500, err.message);
    }
  }

  public async login(email: string, password: string): Promise<ResponseParsed> {
    try {
      const existsUser = await this.userRepository.findOne({
        where: { email },
        include: [this.roleRepository],
      });
      if (!existsUser) {
        return ResponseParse(404, "User not found");
      }

      // compare passwords
      const validPassword = await comparePasswords(password, existsUser.password);
      if (!validPassword) {
        return ResponseParse(403, "Password is invalid");
      }

      // create jwt
      const token = this.jwtService.sign({ id: existsUser.id, role: existsUser.role.name });

      const user = {
        id: existsUser.id,
        token,
      };

      return ResponseParse(200, user);
    } catch (err: any) {
      return ResponseParse(500, err.message);
    }
  }

  public async register(user: User): Promise<ResponseParsed> {
    try {
      const existsUser = await this.userRepository.findOne({ where: { email: user.email } });
      if (existsUser) {
        return ResponseParse(400, "User already exists");
      }
      const hPassword = await hashPassword(user.password);
      const data = { ...user, password: hPassword, roleId: 1, isValid: true };
      const newUser = await this.userRepository.create(data);
      const token = this.jwtService.sign({ id: newUser.id, role: "user" });
      await this.userRepository.update({ token }, { where: { id: newUser.id } });

      const url: string = `${process.env.FRONT_URL || "http://localhost:5173"}/validateAccount/${newUser.id}/${token}`;

      const subject: string = "Activate Account";
      const message: string = `
      <div>
      <p>Active account</p>
      <a href=${url}>Validate</a>
      </div>`;
      await sendMail(user.email, subject, message);

      return ResponseParse(201, { nickname: newUser.nickname, id: newUser.id });
    } catch (err: any) {
      return ResponseParse(500, err.message);
    }
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
}
