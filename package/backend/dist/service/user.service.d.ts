import { User } from "../db/models/user.model";
export declare class UserService {
    private userRepository;
    getAllUsers(): Promise<User[]>;
    createUser(user: User): Promise<User>;
}
