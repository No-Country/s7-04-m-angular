import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Configura la ubicación del archivo .env según el entorno
const envPath = join(__dirname, `../../../.env.${process.env.NODE_ENV}`);

// Carga las variables de entorno desde el archivo .env correspondiente
dotenv.config({ path: envPath });

const connection = new Sequelize({
    dialect:'mysql',
    repositoryMode:true,
    host: process.env.DB_HOST_URL,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [__dirname + './../models'],
        modelMatch: (filename, member) => {
        return filename.substring(0, filename.indexOf('.model')).toLowerCase() === member.toLowerCase();
      },
    
})


export default connection;