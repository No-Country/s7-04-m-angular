import sequelize from './src/db/config/db.config'
import { Role } from './src/db/models/role.model'
import mysql from 'mysql2'

//TODO : Revisar config de los tests, para no tener que crear la base de datos manualmente.



/*
export const init = async () => {
    // Sincroniza la base de datos antes de correr los tests
    console.log("ENVIROMENT TEST LOADED:", process.env.NODE_ENV, "DATABASE:", process.env.DB_NAME)

  
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("[TEST] Connection has been established successfully.");

    //Crear roles si no existen
    console.log("[TEST] Create roles user and admin if not exists.");
    const roleRepo = sequelize.getRepository(Role);
    const roles = await roleRepo.findAll();
    if (roles.length < 1) {
        await roleRepo.bulkCreate([
            { name: "user" },
            { name: "admin" },
        ]);
    }
    console.log("[TEST] Roles created successfully.");
    // Sincroniza la base de datos antes de correr los tests

};


export const end = async () => {
    //Dropeo la base de datos
    console.log("[TEST] Drop database");
    const connection = mysql.createConnection({
        host:process.env.DB_HOST,
        user:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD
    })
    connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME};`, (err, result) => {
        if (err) {
            console.log(err)
        }
    })

    await sequelize.close(); // Cierra la conexión con la base de datos después de correr los tests

};*/