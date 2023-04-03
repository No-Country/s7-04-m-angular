import { User } from "../db/models/user.model";
import sequelize from "../db/config/db.config";
import { hashPassword } from "../utils/hashPassword";
import { comparePasswords } from "../utils/comparePasswords";
import ResponseParse, { ResponseParsed } from "../utils/responseParse";
import { jwtGenerate } from "../utils/jwtGenerate";
import { Role } from "../db/models/role.model";

type dataType = {
  id?: string;
  email?: string;
};

export class UserService {
  private userRepository = sequelize.getRepository(User);
  private roleRepository = sequelize.getRepository(Role);

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
      const token = jwtGenerate(existsUser.id, existsUser.role.name, "1d");

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
      const data = { ...user, password: hPassword, roleId: 1 };
      const newUser = await this.userRepository.create(data);
      return ResponseParse(201, { nickname: newUser.nickname, id: newUser.id });
    } catch (err: any) {
      return ResponseParse(500, err.message);
    }
  }
}
