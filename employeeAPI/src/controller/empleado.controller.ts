import { Request, Response } from "express";
import { IEmpleadoDocumento } from "interface/empleado.interface";
import { empleadoRepository } from "repository/empleado.repository";

class EmpleadoController {
  obtenerTodos(req: Request, res: Response) {
    empleadoRepository.obtenerTodos().then((rs) => {
      res.json(rs);
    });
  }

  crear(req: Request, res: Response) {
    empleadoRepository
      .crear(req.body.empleado as IEmpleadoDocumento)
      .then((rs) => res.json(rs));
  }

  crearVarios(req: Request, res: Response) {
    empleadoRepository
      .crearVarios(req.body.empleados as IEmpleadoDocumento[])
      .then((rs) => res.json(rs));
  }

  actualizar(req: Request, res: Response) {
    empleadoRepository
      .actualizar(req.body.empleado as IEmpleadoDocumento)
      .then((rs) => res.json(rs));
  }

  eliminar(req: Request, res: Response) {
    empleadoRepository
      .eliminar(req.query.id as string)
      .then((rs) => res.json(rs))
      .catch((err) => {
        console.log(err);
      });
  }

  deshabilitar(req: Request, res: Response) {
    empleadoRepository
      .deshabilitar(req.body.id, req.body.notaSalida, req.body.fechaSalida)
      .then((rs) => {
        console.log(rs);
        res.json(rs);
      })
      .catch((err) => console.log(err));
  }
}

export const empleadoController = new EmpleadoController();
