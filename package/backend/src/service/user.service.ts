import { User } from "../db/models/user.model";
import sequelize from "../db/config/db.config";



export class UserService {

    private userRepository = sequelize.getRepository(User);

    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    public async createUser(user: User): Promise<User> {

        
        return await this.userRepository.create(user);
    }

}


