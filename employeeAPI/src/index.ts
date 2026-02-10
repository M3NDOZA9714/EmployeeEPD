import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { route } from "@route/index";
import "dotenv/config";
import { sequelize } from "./database";
import "@model/associations/documento-empleado.assosiation";
import cookieParser from "cookie-parser";

class Server {
  private app!: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.connectDB();
  }

  config(): void {
    this.app.set("port", process.env.PORT ?? 3000);
    this.app.use(morgan("dev"));
    this.app.use(cookieParser());
    this.app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes(): void {
    this.app.use("/api", route);
  }

  start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(`Server running on port ${this.app.get("port")}`);
    });
  }

  async connectDB(): Promise<any> {
    await sequelize.sync({ force: false });
  }
}

const server = new Server();

server.start();

export { server };
