import { Expose, Transform } from "class-transformer";
import { IsEmail, IsStrongPassword, Matches, MinLength} from 'class-validator'



export class RegisterUserDTO {
    @Expose()
    nickname: string;

    @Expose()
    @IsEmail({}, {message: 'Email is not valid'})
    email: string;
    
    @Expose()
    @MinLength(8,{message: 'Password must be at least 8 characters long'})
    @IsStrongPassword({},{message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'})
    password: string;


    constructor(nickname: string, email: string, password: string) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }


}