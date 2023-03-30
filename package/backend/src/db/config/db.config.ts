import { Sequelize } from 'sequelize-typescript';

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
        return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
      },
    
})


export default connection;