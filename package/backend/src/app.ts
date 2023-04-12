import 'reflect-metadata';
//DOTENV SE CARGA DENTRO DEL SIGUIENTE IMPORT, NO MOVER
import connection from "./db/config/db.config";
import { RegisterRoutes } from "../dist/routes";

import express, { Application,Response as ExResponse, Request as ExRequest } from "express";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import cors from "cors";
import  errorHandler from "./utils/errorHandler";

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(morgan("dev"));
    this.app.use(
      cors({
        origin: true,
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    
    this.app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
      return res.send(
        swaggerUi.generateHTML(await import("../dist/swagger.json"))
      )})
    
  

    }

  routes(): void {
    RegisterRoutes(this.app);
    this.app.use(errorHandler)
  }

  async start(): Promise<void> {
    try {
      await connection.authenticate();
      await connection.sync();
      console.log("Connection has been established successfully.");
      this.app.listen(this.app.get("port"), () => {
        console.log("Server on port", this.app.get("port"));
      });
    } catch (err: any) {
      console.error("Unable to connect to the database:", err);
      process.exit(1);
    }
  }
}

const server = new Server();
server.start();
