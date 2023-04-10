import { describe, expect, test, afterAll, beforeAll } from '@jest/globals';
// Importamos el servicio que queremos testear
import { UserService } from '../user.service';
// Importamos el DTO que vamos a usar para crear un usuario
import { RegisterUserDTO } from '../../dto/user/register.user.dto';
import sequelize from '../../db/config/db.config'

//import { init, end } from '../../../preTest';
import { User } from '../../db/models/user.model';
import { UserError } from '../../error/User.error';
import { LoginUserDTO } from '../../dto/user/login.request.dto';
import { LoginResponseDTO } from '../../dto/user/login.response.dto';
import { ResponseDTO } from '../../dto/general/response.dto';



beforeAll(async () => {
    await sequelize.authenticate();
   await sequelize.sync();   
});

// Inicializamos la base de datos


describe("Testing UserService", () => {
    const userService = new UserService(sequelize);


    test("Register new user", async () => {
        //Creo un usuario de prueba con register
        const userDTO: RegisterUserDTO = {
            email: "test@test.com",
            nickname: "test",
            password: "test123A_s"
        }

        await expect(userService.register(userDTO)).resolves.toBeInstanceOf(User);

    });

    test("Register user that already exists", async () => {

        //Creo un usuario de prueba con register
        const userDTO: RegisterUserDTO = {
            email: "test@test.com",
            nickname: "test",
            password: "test123A_s"
        }

        await expect(userService.register(userDTO)).rejects.toThrowError("User already exists");

    });



    test("Login user", async () => {
        //Creo un usuario de prueba con register
        const userDTO: LoginUserDTO = {
            email: "test@test.com",
            password: "test123A_s"
        }

        await expect(userService.login(userDTO.email, userDTO.password)).resolves
            .toBeInstanceOf(LoginResponseDTO);
        const user = await userService.login(userDTO.email, userDTO.password);
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("token");
        

    });

    test("Login user with incorrect password", async () => {
        //Creo un usuario de prueba con register
        const userDTO: LoginUserDTO = {
            email: "test@test.com",
            password: "123456789"
        }

        await expect(userService.login(userDTO.email, userDTO.password)).rejects.toThrowError("Invalid password");

    });


    test("Login user with inexistent email", async () => {

        const userDTO: LoginUserDTO = {
            email: "algo@algoquenoexiste.net",
            password: "123455679"
        }
        await expect(userService.login(userDTO.email, userDTO.password)).rejects.toThrowError("User not found");

    });

    test("Delete test user", async () => {
    
       const user = await userService.getUserByEmail("test@test.com");

         await expect(userService.deleteUser(user.id)).resolves.toBeInstanceOf(ResponseDTO);

    });



});





