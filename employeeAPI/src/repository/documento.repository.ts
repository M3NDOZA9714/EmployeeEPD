import { DocumentoModel } from "@model/documento.model";
import { IDocumento } from "interface/documento.interface";

class DocumentoRepository {
  async obtenerTodos() {
    return DocumentoModel.findAll();
  }

  async crear(documento: IDocumento): Promise<IDocumento> {
    return DocumentoModel.create(documento);
  }

  async actualizar(documento: IDocumento): Promise<number> {
    return (
      await DocumentoModel.update(documento, { where: { id: documento.id } })
    ).flat()[0];
  }

  async eliminar(id: string): Promise<number> {
    return await DocumentoModel.destroy({ where: { id } });
  }
}

export const documentoRepository = new DocumentoRepository();
