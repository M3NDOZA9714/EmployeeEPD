import { Router } from "express";
import fs from "fs";
import path from "path";

class Route {
  public router: Router;

  constructor() {
    this.router = Router();
    this.loadRoutes();
  }

  private loadRoutes(): void {
    fs.readdir(__dirname, (err: any, files: any[]) => {
      if (err) return;

      const tsFiles = files.filter(
        (file) =>
          path.extname(file) === ".ts" && path.basename(file) !== "index.ts"
      );

      tsFiles.forEach((file) => {
        import(path.join(__dirname, file))
          .then((module) => {
            this.router.use(
              `/apiRequest/${this.clearName(path.basename(file))}`,
              module.default
            );
          })
          .catch((err) => {
            console.error(`Error importing ${file}:`, err);
          });
      });
    });
  }

  private clearName(fileName: string) {
    return fileName.split(".").shift();
  }
}

export const route = new Route().router;
