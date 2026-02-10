import { Request, Response } from "express";
import { IDocumento } from "interface/documento.interface";
import { documentoRepository } from "repository/documento.repository";

class DocumentoController {
  obtenerTodos(req: Request, res: Response) {
    documentoRepository.obtenerTodos().then((rs) => res.json(rs));
  }

  crear(req: Request, res: Response) {
    documentoRepository
      .crear(req.body.documento as IDocumento)
      .then((rs) => res.json(rs));
  }

  actualizar(req: Request, res: Response) {
    documentoRepository
      .actualizar(req.body.documento as IDocumento)
      .then((rs) => res.json(rs));
  }

  eliminar(req: Request, res: Response) {
    documentoRepository
      .eliminar(req.query.id as string)
      .then((rs) => res.json(rs));
  }
}

export const documentoController = new DocumentoController();
