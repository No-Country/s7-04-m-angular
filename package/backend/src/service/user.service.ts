import { User } from "../db/models/user.model";
import sequelize from "../db/config/db.config";
import { hashPassword } from "../utils/hashPassword";

type dataType = {
  id?: string;
  email?: string;
};

export class UserService {
  private userRepository = sequelize.getRepository(User);

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll({ attributes: ["nickname", "email"], where: { isValid: true } });
  }

  public async getUser(data: dataType): Promise<User> {
    if (data.id) {
      return await this.userRepository.findOne({ where: { id: data.id }, attributes: ["nickname", "email"] });
    } else {
      return await this.userRepository.findOne({ where: { email: data.email } });
    }
  }

  public async createUser(user: User): Promise<User> {
    const hPassword = await hashPassword(user.password);
    const data = { ...user, password: hPassword };
    return await this.userRepository.create(data);
  }
}
