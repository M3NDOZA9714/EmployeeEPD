import { documentoController } from "@controller/documento.controller";
import { Router } from "express";

class DocumentoRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/obtenerTodos", documentoController.obtenerTodos);
    this.router.post("/crear", documentoController.crear);
    this.router.put("/actualizar", documentoController.actualizar);
    this.router.delete("/eliminar", documentoController.eliminar);
  }
  
}

export default new DocumentoRoute().router;
