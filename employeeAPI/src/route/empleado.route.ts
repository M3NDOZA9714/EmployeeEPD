import { empleadoController } from "@controller/empleado.controller";
import { Router } from "express";

class EmpleadoRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/obtenerTodos", empleadoController.obtenerTodos);
    this.router.post("/crear", empleadoController.crear);
    this.router.post("/crearVarios", empleadoController.crearVarios);
    this.router.put("/actualizar", empleadoController.actualizar);
    this.router.delete("/eliminar", empleadoController.eliminar);
    this.router.patch("/deshabilitar", empleadoController.deshabilitar);
  }
}

export default new EmpleadoRoute().router;
