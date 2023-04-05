import * as dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/index";
import connection from "./db/config/db.config";

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
        origin: "*",
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes(): void {
    this.app.use("/api/v1", router);
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
