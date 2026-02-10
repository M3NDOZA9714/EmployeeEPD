import { DocumentoModel } from "@model/documento.model";
import { DocumentoXEmpleadoModel } from "@model/documentoXempleado.model";
import { EmpleadoModel } from "@model/empleado.model";

EmpleadoModel.belongsToMany(DocumentoModel, {
  through: { model: DocumentoXEmpleadoModel, unique: false },
  foreignKey: "idEmpleado",
  otherKey: "idDocumento",
  as: "documentos",
});
